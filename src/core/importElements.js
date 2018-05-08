'use strict';

const {pipeP} = require('ramda');
const readFile = require('../util/readFile');
const createElements = require('../util/createElements');

//(fileName)
module.exports = pipeP(
  readFile, 
  createElements
)

