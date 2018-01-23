'use strict';

const getObjectDefinitions = require('../util/getObjectDefinitions');
const saveToFile = require('../util/saveToFile');
const {pipeP, prop, converge, identity, useWith} = require('ramda');

// (fileName, env)
module.exports = useWith(
  saveToFile, [
    identity, 
    getObjectDefinitions
  ]
)
