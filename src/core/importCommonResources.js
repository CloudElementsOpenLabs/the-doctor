'use strict';

const {pipe, pipeP, cond, prop, isNil, not, useWith} = require('ramda');
const readFile = require('../util/readFile');
const buildResourcesFromDir = require('../util/buildCommonResourcesFromDir');
const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');

//(fileName)
module.exports = cond([
  [ 
    pipe(prop('file'), isNil, not),
    pipeP(useWith(readFile, [prop('file')]), createObjectDefinitions, createTransformations)
  ],
  [
    pipe(prop('dir'), isNil, not),
    pipeP(useWith(buildResourcesFromDir, [prop('dir')]), createObjectDefinitions, createTransformations)
  ]
])