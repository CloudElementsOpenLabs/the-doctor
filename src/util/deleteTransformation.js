'use strict';

const remove = require('./remove');
const {curry, ifElse, and} = require('ramda');

module.exports = curry(async (env, keyOrId, objectName) => {
  ifElse(and(is(Array), ))
  get(`organizations/elements/${keyOrId}/transformations/${objectName}`, env);
});