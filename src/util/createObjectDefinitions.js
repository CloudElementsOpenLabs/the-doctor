'use strict';
const { find, equals } = require('ramda');
const get = require('./get');
const create = require('./post')
const makePath = objectName => `organizations/objects/${objectName}/definitions`;
const update = require('./update');

module.exports = async (data) => {
    const objectDefinitions = data.objectDefinitions;
    let endpointObjects = [];
    try {
        endpointObjects = await get('organizations/objects/definitions');
    } catch (err) {}
    const objectNames = Object.keys(objectDefinitions);
    let objectName = '';
    for (let i = 0; i < objectNames.length; i++) {
        objectName = objectNames[i];
        let endpointObjectName = find(equals(objectName))(Object.keys(endpointObjects));
        if(endpointObjectName) {
            await update(makePath(endpointObjectName), objectDefinitions[endpointObjectName]);
            console.log(`Updated Object: ${endpointObjectName}`)
        } else {
            await create(makePath(objectName), objectDefinitions[objectName]);
            console.log(`Created Object: ${endpointObjectName}`)
        }
    }
    return data
}

