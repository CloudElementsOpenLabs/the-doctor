'use strict';

const {filter, pipeP, map} = require('ramda');
const {uniqBy} = require('lodash');
const get = require('./get');
const mapP = require('./mapP');
const qs = {where: "extended='true'"};
const getExtendedElements = () => get('elements',qs);
const getAllElements = () => get('elements',"");
const makePath = element => `elements/${element.id}/export`;
const min = arr => arr.map(x=> {return {key: x.key, id:x.id, name:x.name}});
const deleteIds = arr => arr.map(x=> {
    delete x.id;
    x.resources? deleteIds(x.resources) : "";
    x.parameters? deleteIds(x.parameters) : "";
    x.hooks? deleteIds(x.hooks) : "";
    return x;
});

module.exports = async () => {
    
    let extended = await getExtendedElements();
    let elements = await getAllElements();

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
