'use strict';

const {useWith, identity, filter, pipeP, __, map, converge} = require('ramda');
const readFile = require('../util/readFile');
const createElements = require('../util/createElements');

//(fileName, env)
module.exports = useWith(
    createElements, [
      readFile, 
      identity
    ]
)