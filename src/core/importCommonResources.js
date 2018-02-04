'use strict';

const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');
const readFile = require('../util/readFile');
const {pipeP, tap, prop} = require('ramda');

// (fileName)
module.exports = pipeP(
    readFile, 
    tap(pipe(
        prop('objectDefinitions'),
        createObjectDefinitions
    )),
    tap(pipe(
        prop('transformations'),
        createTransformations
    ))
);
