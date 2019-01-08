'use strict';

const { forEachObjIndexed, type, isEmpty } = require('ramda')
const get = require('../util/get')
const findTransformations = require('../util/findTransformations')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveCommonResourcesToDir')
const saveTo = require('./saveTo')

const getData = async (vdrName) => {
  const data = {
    objectDefinitions: await get('organizations/objects/definitions'),
    transformations: await findTransformations()
  }
  //Specific object export
  if(vdrName !== undefined && type(vdrName) !== 'Function') {
    let transformations = {}
    forEachObjIndexed((element,elementKey) => {
      if(element[vdrName] !== undefined) {
        transformations[elementKey] = {}
        transformations[elementKey][vdrName] = element[vdrName]
      }
    })(data.transformations)
    data.objectDefinitions = data.objectDefinitions[vdrName] ? { [vdrName] : data.objectDefinitions[vdrName] } : {}
    data.transformations = transformations

    if(!data.objectDefinition && isEmpty(data.transformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
    }
  }
  return data
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
