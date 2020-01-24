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

module.exports = async () => {
    let extended = await getExtendedElements();
    let elements = await getAllElements()
    //strip objects down to make them easy to compare as well as filter for the 2 types of elements we care about
    let priv = min(elements.filter(element => element.private==true));
    extended = min(extended.filter(element => element.extended==true));
    //
    //create a superset of those elements
    let superset = priv.concat(extended);
    //return only unique elements
    let uniqElements = uniqBy(superset,'id');
    //create the necessary path for GET/{id} for each of the unique elements
    let pathsArr = map(makePath, uniqElements);
    //an array of promises that returns the GET/{id} for the elements we care about
    let getByIdArr = pathsArr.map(path => get(path,""));
    return await Promise.all(getByIdArr);
};
