'use strict';

const {pipe, pipeP, cond, prop, isNil, not, useWith, type, equals, __} = require('ramda');
const readFile = require('../util/readFile');
const applyVersion = require('../util/applyVersion')
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');
var fs = require('fs');

//(fileName)
module.exports = options => {
  return cond([
  [ 
    pipe(prop('file'), isNil, not),
    pipeP(
      pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options)),
      cond([
        [
          pipe(type, equals('Object')) && pipe(prop('formulas'), isNil, not),
          pipe(prop('formulas'), createFormulas)
        ],
        [
          pipe(type, equals('Array')),
          createFormulas
        ]
      ])
    )
  ],
  [
    pipe(prop('dir'), isNil, not),
    pipeP(
      useWith(buildFormulasFromDir, [prop('dir')]), applyVersion(__, options), 
      createFormulas)
  ]
])(options)
}