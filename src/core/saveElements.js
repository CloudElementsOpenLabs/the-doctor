'use strict';

const {identity, converge} = require('ramda');
const getElements = require('../util/getElements');
const saveToFile = require('../util/saveToFile');

//(fileName)
module.exports = converge(
    saveToFile, [
      identity, 
      getElements
    ]
)