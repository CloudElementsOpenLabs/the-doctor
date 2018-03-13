'use strict';

const {pipeP} = require('ramda');
const deleteTransformations = require('../util/deleteTransformations');
const deleteObjectDefinitions = require('../util/deleteObjectDefinitions')
const findTransformations = require('../util/findTransformations');

module.exports = pipeP(
    findTransformations,
    deleteTransformations,
    deleteObjectDefinitions
)