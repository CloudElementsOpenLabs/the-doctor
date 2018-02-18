'use strict';

const {pipeP} = require('ramda');
const readFile = require('../util/readFile');
const createFormulas = require('../util/createFormulas');

//(fileName)
module.exports = pipeP(
  readFile, 
  createFormulas
)

