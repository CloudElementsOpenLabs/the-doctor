'use strict';

const { forEachObjIndexed, isEmpty, isNil, pipeP, __, keys, uniq, flatten, pipe, prop} = require('ramda')
const http = require('../util/http')
const get = require('../util/get')
const mapP = require('../util/mapP');
const applyVersion = require('../util/applyVersion')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveCommonResourcesToDir')
const saveTo = require('./saveTo')

// Utils
const isNotNilAndEmpty = value => !isNil(value) && !isEmpty(value);
const isNilOrEmpty = value => isNil(value) || isEmpty(value);

const getVdrsObjectsTransformations = (objectDefinitions, vdrLevel) => {
  const finalTransformationsObject = {};
  const vdrsKeys = keys(objectDefinitions);
  const transformationPathList = isNotNilAndEmpty(vdrsKeys)
    ? vdrsKeys.map(vdrkey => `${vdrLevel}/objects/${vdrkey}/transformations`)
    : [];
  const transformationList = mapP(get)(transformationPathList);
  console.log(transformationList);
  const elementKeyList = uniq(flatten(pipe(prop('element'), prop('key'))(transformationList)));
  isNotNilAndEmpty(elementKeyList)
    ? Promise.all([elementKeys.forEach(elementKey => {
      const transformationsForElementKey = http(`${vdrLevel}/elements/${elementKey}/transformations`, 'GET');
      return finalTransformationsObject = assoc(elementKey, transformationsForElementKey, finalTransformationsObject);
    })])
    : Promise.resolve([]);
  return finalTransformationsObject;
}

const getData = async (vdrName, vdrLevel) => {
  // Determine what needs to be done here
  // 1. Should return only organizations vdrs?
  // 2. Should return only accounts vdrs?
  // 3. Should return both organizations and accounts vdrs?

  if (isNotNilAndEmpty(vdrName) && isNotNilAndEmpty(vdrLevel)) {
    const objectDefinitions = await get(`${vdrLevel}/objects/definitions`);
    const objectTransformations = getVdrsObjectsTransformations(objectDefinitions, vdrLevel);
    if(isNotNilAndEmpty (objectDefinitions) && isNotNilAndEmpty(objectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      [vdrName]: objectDefinitions.vdrName,
      transformations: objectTransformations
    }

  } else if (isNotNilAndEmpty(vdrName) && isNilOrEmpty(vdrLevel)) {
    const organizationsObjectDefinitions = await http(`organizations/objects/definitions`, 'GET');
    const organizationsObjectTransformations = getVdrsObjectsTransformations(objectDefinitions, 'organizations');

    const accountsObjectDefinitions = await http(`accounts/objects/definitions`, 'GET');
    const accountsObjectTransformations = getVdrsObjectsTransformations(objectDefinitions, 'accounts');

    // merge both organizations and accounts object definitions and transformations data
    

    if(isNotNilAndEmpty(organizationsObjectDefinitions) && isNotNilAndEmpty(organizationsObjectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      vdrName,
      orgDef: organizationsObjectDefinitions,
      orgTrans: organizationsObjectTransformations,
      accDef: accountsObjectDefinitions,
      accTrans: accountsObjectTransformations
    }
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
module.exports = params => {
  if (params.options.hasOwnProperty('version')){
    params.options.name = params.options.name + '_' + params.options.version
  }
  return saveTo(pipeP(getData, applyVersion(__, params)), log, saveToFile, saveToDir)(params)
}
