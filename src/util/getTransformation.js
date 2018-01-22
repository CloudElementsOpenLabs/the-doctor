'use strict';

const get = require('./get');
const {curry} = require('ramda');

module.exports = curry(async (keyOrId, objectName, env) => get(`organizations/elements/${keyOrId}/transformations/${objectName}`, env));