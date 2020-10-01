'use strict';
const {pipeP, pipe, map, flatten, prop, filter, uniq} = require('ramda');
const mapP = require('./mapP');
const get = require('./get');
const getObjectDefinitions = require('./getObjectDefinitions');
const makePathObjects = key => `organizations/objects/${key}/transformations`;
const makePathTransformations = elementKey => `organizations/elements/${elementKey}/transformations`;
const filterOrgLevel = transformationMeta => transformationMeta.level === 'organization';
const elementKeyLens = pipe(prop('element'), prop('key'));

const getObjectNames = pipeP(
    getObjectDefinitions,
    Object.keys       
);

const getElementKeys = pipeP(
    get,
    filter(filterOrgLevel),
    map(elementKeyLens)
)

const createObject = async (objectNames) => {
    let object = {};
    let paths = map(makePathTransformations)(objectNames);
    for (let i = 0; i < objectNames.length; i++) {
        object[objectNames[i]] = await get(paths[i]);
    }
    return object;
}

module.exports = pipeP(
    getObjectNames,
    map(makePathObjects),
    mapP(getElementKeys),
    flatten,
    uniq,
    createObject
);
