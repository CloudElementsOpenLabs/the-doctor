'use strict';
const {map, find, equals} = require('ramda');
const get = require('./get');
const create = require('./post')
const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const makePathGet = elementKey => `organizations/elements/${elementKey}/transformations`
const update = require('./update');

module.exports = async (transformations) => {
    map(async elementKey => {
        let endpointTransformations = get(makePathGet(elementKey));
        map(async objectName => {
            let endpointObjectName = find(equals(objectName))(endpointTransformations.keys);
            if(endpointObjectName) {
                await update(makePath(elementKey, endpointObjectName), transformations[elementKey][endpointObjectName]);
            } else {
                await create(makePath(elementKey, objectName), transformations[elementKey][objectName]);
            }
        })(transformations[elementKey].keys)
    })(transformations.keys);
}

