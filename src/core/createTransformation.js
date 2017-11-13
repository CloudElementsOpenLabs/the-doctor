'use strict';

const post = require('./post');
const {curry} = require('ramda');

module.exports = curry(async (env, keyOrId, objectName, body) => 
  post(`organizations/elements/${keyOrId}/transformations/${objectName}`, env, body));