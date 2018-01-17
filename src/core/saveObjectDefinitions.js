'use strict';

const getObjectDefinitions = require('../util/getObjectDefinitions');
const saveToFile = require('../util/saveToFile');
const {pipeP, prop, converge} = require('ramda');

module.exports = (environment, options) => {
  const fileName = options.file;
  pipeP(
    getObjectDefinitions,
    saveToFile(fileName)
  )(environment);
}

