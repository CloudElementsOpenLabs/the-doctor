'use strict';

const {filter,type, pipeP, map} = require('ramda');
const {uniqBy} = require('lodash');
const get = require('./get');
const mapP = require('./mapP');

const getExtendedElements = (qs) => get('elements',qs);
const getAllElements = (param) => get('elements',param);
const makePath = element => `elements/${element.id}/export`;
const min = arr => arr.map(x=> {return {key: x.key, id:x.id, name:x.name}});
const deleteIds = arr => arr.map(x=> {
    delete x.id;
    x.resources? deleteIds(x.resources) : "";
    x.parameters? deleteIds(x.parameters) : "";
    x.hooks? deleteIds(x.hooks) : "";
    return x;
});

module.exports = async (keys) => {
    let qs = {where: "extended='true'"};
    let param = ""
    if (type(keys) === 'String') {
        var key = '\'' + keys.replace(/ /g, '').replace(/,/g, '\',\'') + '\'';
        param = {where: "key in (" + key + ")"};
        qs = {where: "extended='true' AND key in (" + key + ")"};
    }
    let extended = await getExtendedElements(qs);
    let elements = await getAllElements(param);

    //strip objects down to make them easy to compare as well as filter for the 2 types of elements we care about
    let priv = min(elements.filter(element => element.private==true));
    extended = min(extended.filter(element => element.extended==true));

    //create a superset of those elements
    let superset = priv.concat(extended);

    //return only unique elements
    let uniqElements = uniqBy(superset,'id');

    //create the necessary path for GET/{id} for each of the unique elements
    let pathsArr = map(makePath, uniqElements);

    //an array of promises that returns the GET/{id} for the elements we care about
    let getByIdArr = pathsArr.map(path => get(path,""));

    let elementsExport = await Promise.all(getByIdArr);
    let finalExport = [];

    for(let i=0; i<elementsExport.length; i++){
        if(elementsExport[i].extended === true){
            const resources = await get(`elements/${elementsExport[i].key}/resources`,"");
            const accountOwnedResources = resources.filter(resource => resource.ownerAccountId !== 1);
            let newElem = {...elementsExport[i]};
            if(accountOwnedResources.length>0){
                newElem.actuallyExtended = true;
                newElem.resources = deleteIds(accountOwnedResources);
                // newElem.resources.parameters = deleteIds(newElem.resources.parameters);
                // newElem.resources.hooks = deleteIds(newElem.resources.hooks);
            };

            finalExport.push(newElem);

        }else {
            finalExport.push(elementsExport[i]);
        }
    }

    return finalExport;
};
