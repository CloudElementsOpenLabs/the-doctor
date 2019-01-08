'use strict';
const mapP = require('./mapP');
const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const remove = require('./remove');

module.exports = async (transformations) => {
    await mapP(async elementKey => {
        await mapP(async objectName => {
            console.log(`Deleted Transformation: ${objectName} - ${elementKey}`)
            await remove(makePath(elementKey, objectName));
        })(Object.keys(transformations[elementKey]))
    })(Object.keys(transformations));
};