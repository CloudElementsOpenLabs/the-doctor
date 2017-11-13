'use strict';

const get = require('./get');
const {curry, map, is, ifElse} = require('ramda');

module.exports = curry(async (env, keyOrId) => {
  ifElse(is(Array, keyOrId), 
    map(keyOrId => get(`organizations/elements/${keyOrId}/transformations`, env), keyOrId), 
    get(`organizations/elements/${keyOrId}/transformations`, env, keyOrId))
});