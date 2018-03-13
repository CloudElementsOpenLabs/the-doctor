'use strict';

const get = require('../util/get');
const saveToFile = require('../util/saveToFile');
const {pipeP, prop, converge, identity, useWith} = require('ramda');

// (fileName, env)
module.exports = useWith(
  saveToFile, [
    identity, 
    get('organizations/objects/definitions')
  ]
);
