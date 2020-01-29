'use strict';

const {useWith, identity} = require('ramda');
const getExecution = require('../util/get')('formulas/instances/executions/');
const save = require('../util/saveToFile');

//(parms)
module.exports = useWith(
    save, [
      identity, 
      getExecution
    ]
  )