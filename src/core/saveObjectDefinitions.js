'use strict';

const get = require('../util/get');
const save = require('../util/saveToFile');
const {identity, useWith} = require('ramda');

// (parms, env)
module.exports = useWith(
  save, [
    identity, 
    get('organizations/objects/definitions',"")
  ]
);