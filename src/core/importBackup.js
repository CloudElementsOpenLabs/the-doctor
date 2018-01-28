'use strict';

const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');
const createFormulas = require('../util/createFormulas');
const createElements = require('../util/createElements');
const readFile = require('../util/readFile');
const {pipeP, tap, prop} = require('ramda');

// (fileNamee)
module.exports = pipeP(
    readFile, 
    tap(pipeP(
        prop('objectDefinitions'),
        createObjectDefinitions
    )),
    tap(pipeP(
        prop('transformations'),
        createTransformations
    )),
    tap(pipeP(
        prop('formulas'),
        createFormulas
    )),
    tap(pipeP(
        prop('elements'),
        createElements
    ))
);