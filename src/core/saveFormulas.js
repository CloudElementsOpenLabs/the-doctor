'use strict';

const {converge, identity} = require('ramda');
const getFormulas = require('../util/getFormulas');
const saveToFile = require('../util/saveToFile');

//(fileName)
module.exports = converge(
    saveToFile, [
      identity, 
      getFormulas
    ]
  )