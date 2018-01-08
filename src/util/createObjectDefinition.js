'use strict';

const post = require('./post');
const {curry} = require('ramda');

module.exports = curry(async (env, objectName, body) => 
  post(`organizations/objects/${objectName}/definitions`, env, body));