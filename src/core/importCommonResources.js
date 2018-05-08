'use strict';

const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');
const readFile = require('../util/readFile');
const {pipeP, tap, prop, pipe} = require('ramda');

// (fileName)
module.exports = pipeP(
    readFile, 
    createObjectDefinitions,
    createTransformations
);

