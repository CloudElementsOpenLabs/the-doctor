'use strict';

const {useWith, identity} = require('ramda');
const getFormulas = require('../util/getFormulas');
const saveToFile = require('../util/saveToFile');

//(fileName, env)
module.exports = useWith(
    saveToFile, [
      identity, 
      getFormulas
    ]
  )