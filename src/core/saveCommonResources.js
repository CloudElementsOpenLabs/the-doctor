'use strict';

const {equals, forEachObjIndexed, isEmpty, isNil, pipeP, __, keys, uniq, flatten, pipe, prop, assoc} = require('ramda')
const get = require('../util/get')
const applyVersion = require('../util/applyVersion')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveCommonResourcesToDir')
const saveTo = require('./saveTo')

// Utils
const isNotNilAndEmpty = value => !isNil(value) && !isEmpty(value);
const isNilOrEmpty = value => isNil(value) || isEmpty(value);

const getVdrsObjectsTransformations = async (objectDefinitions, vdrLevel, accountId) => {
  let finalTransformationObject = {};
  let transformationList = [];
  let transformationsForElementKey = [];
  const vdrsKeys = keys(objectDefinitions);
  const transformationPromiseList = isNotNilAndEmpty(vdrsKeys)
    ? vdrsKeys.map(vdrkey => equals(vdrLevel, 'accounts') && isNotNilAndEmpty(accountId)
      ? get(`${vdrLevel}/${accountId}/objects/${vdrkey}/transformations`) 
      : get(`${vdrLevel}/objects/${vdrkey}/transformations`))
    : Promise.resolve([]);
  await Promise.all(transformationPromiseList)
    .then(response => {
      return transformationList.push(response)
    })
    .catch(error => {
      throw error;
    });
  const elementKeyList = isNotNilAndEmpty(transformationList) ? 
    flatten(transformationList).map(transformation => pipe(prop('element'), prop('key'))(transformation))
    : [];
  const transformationsPromiseListForElementKey = isNotNilAndEmpty(elementKeyList)
    ? uniq(elementKeyList).map(elementKey => equals(vdrLevel, 'accounts') && isNotNilAndEmpty(accountId)
      ? get(`${vdrLevel}/${accountId}/elements/${elementKey}/transformations`)
      : get(`${vdrLevel}/elements/${elementKey}/transformations`))
    : Promise.resolve([]);
  await Promise.all(transformationsPromiseListForElementKey)
    .then(response => {
      return transformationsForElementKey.push(response)
    })
    .catch(error => {
      throw error;
    });
    transformationsForElementKey = flatten(transformationsForElementKey);
    elementKeyList.forEach((elementKey, index) => {
      return finalTransformationObject[elementKey] = transformationsForElementKey[index];
    });
    return finalTransformationObject;
}

const getData = async (vdrName, vdrLevel, account) => {
  // Determine what needs to be done here
  // 1. Should return only organizations vdrs?
  // 2. Should return only accounts vdrs?
  // 3. Should return both organizations and accounts vdrs?
  if (isNotNilAndEmpty(vdrName) && isNotNilAndEmpty(vdrLevel)) {
    const objectDefinitions = await get(`${vdrLevel}/objects/definitions`);
    const objectTransformations = await getVdrsObjectsTransformations(objectDefinitions, vdrLevel, account);
    if(isNilOrEmpty(objectDefinitions) && isNilOrEmpty(objectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      name: vdrName,
      objectDefinitions: objectDefinitions[vdrName],
      transformations: objectTransformations
    }

  } else if (isNotNilAndEmpty(vdrName) && isNilOrEmpty(vdrLevel)) {
    const organizationsObjectDefinitions = await get(`organizations/objects/definitions`);
    const organizationsObjectTransformations = await getVdrsObjectsTransformations(organizationsObjectDefinitions, 'organizations');
    
    const accountsObjectDefinitions = await get(`accounts/objects/definitions`);
    const accountsObjectTransformations = await getVdrsObjectsTransformations(accountsObjectDefinitions, 'accounts', account);    
    
    if(isNilOrEmpty(organizationsObjectDefinitions) && isNilOrEmpty(organizationsObjectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      name: vdrName,
      objectDefinitions: [
        organizationsObjectDefinitions[vdrName],
        accountsObjectDefinitions[vdrName]
      ],
      transformations: uniq([
        organizationsObjectTransformations,
        accountsObjectTransformations
      ]),
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
