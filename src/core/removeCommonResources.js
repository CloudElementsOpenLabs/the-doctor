'use strict';

const {pipeP, prop} = require('ramda');
const deleteTransformations = require('../util/deleteTransformations');
const deleteObjectDefinitions = require('../util/deleteObjectDefinitions')
const findTransformations = require('../util/findTransformations');

module.exports = pipeP(
    findTransformations,
    prop('transformations'), 
    deleteTransformations,
    deleteObjectDefinitions
)