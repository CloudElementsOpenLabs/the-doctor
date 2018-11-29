'use strict';

const {identity, converge, pipe, pipeP, tap, prop, map} = require('ramda');
const getElements = require('../util/getElements');
const save = require('../util/save');
const makeMessage = name => `Saved Element: ${name}.`

const log = tap(map(pipe(prop('name'), makeMessage, console.log)))

//(parms)
module.exports = converge(
  save, [
    identity,
    pipeP(
      getElements, 
      log
    )
  ])