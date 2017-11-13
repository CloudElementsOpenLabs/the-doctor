'use strict';

const get = require('./get');
const {curry} = require('ramda');

module.exports = curry(async (env, objectName) => {
  ifElse(is(Array, objectName), 
    map(objectName => get(`organizations/objects/${objectName}/definitions`, env), objectName), 
    get(`organizations/elements/${objectName}/transformations`, env))
});