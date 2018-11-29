'use strict';

const {converge, identity, pipe, pipeP, tap, prop, map} = require('ramda');
const getFormulas = require('../util/getFormulas');
const save = require('../util/save');
const makeMessage = name => `Saved Formula: ${name}.`

const log = tap(map(pipe(prop('name'), makeMessage, console.log)))

//(parms)
module.exports = converge(
  save, [
    identity,
    pipeP(
      getFormulas, 
      log
    )
  ])