'use strict';

const getTransformations = require('../util/getTransformations');
const saveToFile = require('../util/saveToFile');
const {pipeP, curry} = require('ramda');

module.exports = (environment, options) => {
  const fileName = options.file;
  const keys = options.keys;

  return pipeP(
    getTransformations(environment),
    saveToFile(fileName)
  )(keys);
};

