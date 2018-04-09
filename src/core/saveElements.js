'use strict';

const {identity, converge} = require('ramda');
const getElements = require('../util/getElements');
const save = require('../util/save');

//(parms)
module.exports = converge(
    save, [
      identity, 
      getElements
    ]
)