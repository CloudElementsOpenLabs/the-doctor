'use strict';

const get = require('../util/get');
const findTransformations = require('../util/findTransformations');
const saveToFile = require('../util/saveToFile');
const {identity, converge} = require('ramda');

const getData = async () => {
  return {
    objectDefinitions: await get('organizations/objects/definitions'),
    transformations: await findTransformations()
  };
}
//(fileName)
module.exports = converge(
  saveToFile, [
    identity, 
    getData
  ]
);