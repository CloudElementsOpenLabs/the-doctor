'use strict';

const getTransformations = require('../util/getTransformations');
const saveToFile = require('../util/saveToFile');
const isError = require('../util/isError');
const {converge, call, prop, curry} = require('ramda');

module.exports = converge(
  saveToFile, [ 
  prop('fileName'), 
  call(getTransformations, [
    prop("from"), 
    prop("elementKeys")])
  ]
);
