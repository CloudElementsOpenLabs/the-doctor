'use strict';

const get = require('./get');
const {curry} = require('ramda');

module.exports = curry(async (env, keyOrId, objectName) => get(`organizations/elements/${keyOrId}/transformations/${objectName}`, env));