'use strict';

const {pipe} = require('ramda');
const readFile = require('../util/readFile');
const createElements = require('../util/createElements');

//(fileName)
module.exports = pipe(
  readFile, 
  createElements
)

