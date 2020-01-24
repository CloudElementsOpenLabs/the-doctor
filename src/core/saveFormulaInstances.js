'use strict';

const {useWith, identity} = require('ramda');
const getFormulasInstances = require('../util/get')('formulas/instances',"");
const save = require('../util/saveToFile');

//(parms)
module.exports = useWith(
    save, [
      identity, 
      getFormulasInstances
    ]
  )