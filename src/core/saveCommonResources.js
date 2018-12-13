'use strict';

const {forEachObjIndexed, prop, keys} = require('ramda');
const get = require('../util/get');
const findTransformations = require('../util/findTransformations');
const saveToFile = require('../util/saveToFile');
const saveToDir = require('../util/saveCommonResourcesToDir');
const saveTo = require('./saveTo')

const getData = async () => {
  return {
    objectDefinitions: await get('organizations/objects/definitions'),
    transformations: await findTransformations()
  }
}

const log = data => {
  forEachObjIndexed((object,key) => {
    console.log(`Saved Object: ${key}.`)
  })(data.objectDefinitions)
  
  forEachObjIndexed((element,elementKey) => {
    forEachObjIndexed((transformation,tKey) => {
      console.log(`Saved Transformation: ${tKey} - ${elementKey}.`)
    })(element)
  })(data.transformations)
}

//(parms)
module.exports = saveTo(getData, log, saveToFile, saveToDir)
