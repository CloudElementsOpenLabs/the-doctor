'use strict';

const getTransformations = require('../util/getTransformations');
const findTransformations = require('../util/findTransformations');
const saveToFile = require('../util/saveToFile');
const {pipeP, curry} = require('ramda');

module.exports = (environment, options) => {
  const fileName = options.file;
  pipeP(
    findTransformations,
    saveToFile(fileName)
  )(environment);
};

