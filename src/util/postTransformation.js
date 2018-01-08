'use strict';

const post = require('./post');
const {curry} = require('ramda');

module.exports = curry((keyOrId, objectName) => post(`organizations/elements/${keyOrId}/transformations/${objectName}`));
