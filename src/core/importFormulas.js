'use strict';

const {pipe} = require('ramda');
const readFile = require('../util/readFile');
const createFormulas = require('../util/createFormulas');

//(fileName)
module.exports = pipe(
  readFile, 
  createFormulas
)

