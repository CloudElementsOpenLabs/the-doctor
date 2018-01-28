'use strict';

const {pipeP, __, filter, prop, map, curry, compose, assocPath, merge} = require('ramda');
const get = require('./get');
const getObjectDefinitions = require('./getObjectDefinitions');
const makePath = key => `organizations/objects/${key}/transformations`;
const filterOrgLevel = transformationMeta => transformationMeta.level === 'organization';
const elementKeyLens = compose(prop('key'), prop('element'));

const getObjectNames = pipeP(
    getObjectDefinitions,
    Object.keys       
);

const getTransformations = curry(async (transformations, objectName) => {
    const path = makePath(objectName);
    const elementKeys = await pipeP( 
        get,
        filter(filterOrgLevel),
        map(elementKeyLens)
    )(path);
    for (let i = 0; i < elementKeys.length; i++) {
        transformations = assocPath([elementKeys[i], objectName], await get(`organizations/elements/${elementKeys[i]}/transformations/${objectName}`), transformations);
    }
    return transformations;
});

module.exports = async () => {
    const objectNames = await getObjectNames();
    let transformations = {};
    for (let i = 0; i < objectNames.length; i++) {
        transformations = merge(transformations, await getTransformations({}, objectNames[i]))
    }
    return transformations;
};

