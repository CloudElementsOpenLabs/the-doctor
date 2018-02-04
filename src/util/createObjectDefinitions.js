'use strict';
const {map, find, equals} = require('ramda');
const get = require('./get');
const create = require('./post')
const makePath = objectName => `organizations/objects/${objectName}/definitions`;
const update = require('./update');

module.exports = async (objectDefinitions) => {
    let endpointObjects = await get('organizations/objects/definitions');
    map(async objectName => {
        let endpointObjectName = find(equals(objectName))(endpointObjects.keys);
        if(endpointObjectName) {
            await update(makePath(endpointObjectName), objectDefinitions[endpointObjectName]);
        } else {
            await create(makePath(objectName), objectDefinitions[objectName]);
        }
    })(objectDefinitions.keys);
}

