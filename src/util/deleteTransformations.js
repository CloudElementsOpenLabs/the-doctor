'use strict';
const {map, find, equals} = require('ramda');
const mapP = require('./mapP');
const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const remove = require('./remove');

module.exports = async (transformations) => {
    await maP(async elementKey => {
        maP(async objectName => {
            remove(makePath(elementKey, objectName));
        })(Object.keys(transformations[elementKey]))
    })(Object.keys(transformations));
};