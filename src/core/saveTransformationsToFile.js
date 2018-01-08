'use strict';

const getTransformations = require('./getTransformations');
const saveToFile = require('./saveToFile');
const isError = require('./isError');
const {converge, call, prop, curry} = require('ramda');

module.exports = converge(
  saveToFile, [ 
  prop('fileName'), 
  call(getTransformations, [
    prop("from"), 
    prop("elementKeys")])
  ]
);
