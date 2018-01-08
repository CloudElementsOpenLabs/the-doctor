'use strict';

const getObjectDefinitions = require('../util/getObjectDefinitions');
const saveToFile = require('../util/saveToFile');
const {pipeP, prop, converge} = require('ramda');

module.exports = (environment, fileName) => {
  pipeP(
    getObjectDefinitions,
    saveToFile(fileName)
  )(environment);
}

