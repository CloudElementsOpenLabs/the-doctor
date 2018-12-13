'use strict';

const {pipe, pipeP, cond, prop, isNil, not, useWith} = require('ramda');
const readFile = require('../util/readFile');
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');

//(fileName)
module.exports = cond([
  [ 
    pipe(prop('file'), isNil, not),
    pipeP(useWith(readFile, [prop('file')]), createFormulas)
  ],
  [
    pipe(prop('dir'), isNil, not),
    pipeP(useWith(buildFormulasFromDir, [prop('dir')]), createFormulas)
  ]
])
