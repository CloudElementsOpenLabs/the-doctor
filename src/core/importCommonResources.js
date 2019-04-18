'use strict';

const {pipe, pipeP, cond, prop, isNil, not, useWith, __} = require('ramda');
const readFile = require('../util/readFile');
const buildResourcesFromDir = require('../util/buildCommonResourcesFromDir');
const applyVersion = require('../util/applyVersion')
const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');

//(fileName)
module.exports = options => {
  cond([
    [ 
      pipe(prop('file'), isNil, not),
      pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options), createObjectDefinitions, createTransformations)
    ],
    [
      pipe(prop('dir'), isNil, not),
      pipeP(useWith(buildResourcesFromDir, [prop('dir')]), applyVersion(__, options), createObjectDefinitions, createTransformations)
    ]
  ])(options)
}
