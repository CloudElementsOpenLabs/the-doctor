'use strict';

const getTransformations = require('../util/getTransformations');
const findTransformations = require('../util/findTransformations');
const saveToFile = require('../util/saveToFile');
const {useWith, identity} = require('ramda');

//(fileName, env)
module.exports = useWith(
  saveToFile, [
    identity, 
    findTransformations
  ]
);