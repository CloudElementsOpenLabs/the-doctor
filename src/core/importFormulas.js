'use strict';

const {pipe, pipeP, cond, prop, isNil, not, useWith, type, equals} = require('ramda');
const readFile = require('../util/readFile');
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');

//(fileName)
module.exports = cond([
  [ 
    pipe(prop('file'), isNil, not),
    pipeP(
      useWith(readFile, [prop('file')]),
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
      useWith(buildFormulasFromDir, [prop('dir')]), 
      createFormulas)
  ]
])
