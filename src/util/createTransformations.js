'use strict';
const {map, find, equals} = require('ramda');
const get = require('./get');
const create = require('./post')
const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const makePathGet = elementKey => `organizations/elements/${elementKey}/transformations`
const update = require('./update');

module.exports = async (transformations) => {
    transformations = transformations.transformations;
    map(async elementKey => {
        let endpointTransformations = [];
        try {
            endpointTransformations = await get(makePathGet(elementKey));
        } catch (err) {}
        map(async objectName => {
            let endpointObjectName = find(equals(objectName))(Object.keys(endpointTransformations));
            if(endpointObjectName) {
                await update(makePath(elementKey, endpointObjectName), transformations[elementKey][endpointObjectName]);
                console.log(`Updated Transformation: ${endpointObjectName} - ${elementKey}`)
            } else {
                await create(makePath(elementKey, objectName), transformations[elementKey][objectName]);
                console.log(`Created Transformation: ${endpointObjectName} - ${elementKey}`)
            }
        })(Object.keys(transformations[elementKey]))
    })(Object.keys(transformations));
}

