'use strict';

const {useWith, identity} = require('ramda');
const getFormulasInstances = require('../util/get')('formulas/instances');
const saveToFile = require('../util/saveToFile');

//(fileName, env)
module.exports = useWith(
    saveToFile, [
      identity, 
      getFormulasInstances
    ]
  )