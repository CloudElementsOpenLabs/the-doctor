'use strict';

const get = require('../util/get');
const findTransformations = require('../util/findTransformations');
const save = require('../util/save');
const {identity, converge} = require('ramda');

const getData = async () => {
  return {
    objectDefinitions: await get('organizations/objects/definitions'),
    transformations: await findTransformations()
  };
}
//(parms)
module.exports = converge(
  save, [
    identity, 
    getData
  ]
);