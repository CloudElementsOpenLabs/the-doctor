'use strict';

const getObjectDefinitions = require('../util/getObjectDefinitions');
const saveToFile = require('../util/saveToFile');
const {pipeP, prop, converge} = require('ramda');

module.exports = async (environment, options) => {
  const fileName = options.file;
  return await pipeP(
    getObjectDefinitions,
    saveToFile(fileName)
  )(environment);
}

