'use strict';

const getObjectDefinitions = require('./getObjectDefinitions');
const saveToFile = require('./saveToFile');
const {pipeP} = require('ramda');

module.exports = async (env, fileName) => {
  return pipeP(
    getObjectDefinitions,
    saveToFile(fileName)
  )(env);
};