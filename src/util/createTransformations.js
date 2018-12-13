'use strict';
const {map, find, equals, keys} = require('ramda');
const get = require('./get');
const create = require('./post')
const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const makePathGet = elementKey => `organizations/elements/${elementKey}/transformations`
const update = require('./update');

module.exports = async (data) => {
    const transformations = data.transformations;
    map(async elementKey => {
        let endpointTransformations = [];
        try {
            endpointTransformations = await get(makePathGet(elementKey));
        } catch (err) {}
        map(async objectName => {
            const endpointObjectName = find(equals(objectName))(keys(endpointTransformations));
            if(endpointObjectName) {
                await update(makePath(elementKey, endpointObjectName), transformations[elementKey][endpointObjectName]);
                console.log(`Updated Transformation: ${endpointObjectName} - ${elementKey}`)
            } else {
                await create(makePath(elementKey, objectName), transformations[elementKey][objectName]);
                console.log(`Created Transformation: ${objectName} - ${elementKey}`)
            }
        })(keys(transformations[elementKey]))
    })(keys(transformations));
}

