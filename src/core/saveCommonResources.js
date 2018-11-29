'use strict';

const get = require('../util/get');
const findTransformations = require('../util/findTransformations');
const save = require('../util/save');
const {identity, converge, tap, map, prop, keys, pipeP} = require('ramda');

const getData = async () => {
  return {
    objectDefinitions: await get('organizations/objects/definitions'),
    transformations: await findTransformations()
  };
}

const log = async data => {
  map(object => {
    console.log(`Saved Object: ${prop('objectName',object)}.`)
  })(data.objectDefinitions)
  map(element => {
    map(transformation => {
      console.log(`Saved Transformation: ${prop('objectName',transformation)} - ${element}.`)
    })(data.transformations[element])
  })(keys(data.transformations))
}

//(parms)
module.exports = converge(save, [identity, pipeP(getData, tap(log))])