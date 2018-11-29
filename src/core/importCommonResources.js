'use strict';

const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');
const readFile = require('../util/readFile');
const {pipeP} = require('ramda');

// (fileName)
module.exports = pipeP(
    readFile, 
    createObjectDefinitions,
    createTransformations
);

