'use strict';
const {map, find, equals} = require('ramda');
const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const remove = require('./remove');

module.exports = async (transformations) => {
    map(async elementKey => {
        map(async objectName => {
            remove(makePath(elementKey, objectName));
        })(transformations[elementKey].keys)
    })(transformations.keys);
};