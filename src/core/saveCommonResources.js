'use strict';

const {equals, forEachObjIndexed, isEmpty, isNil, pipeP, __, head, uniq, flatten, pipe, prop, assoc} = require('ramda')
const get = require('../util/get')
const applyVersion = require('../util/applyVersion')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveCommonResourcesToDir')
const saveTo = require('./saveTo')

// Utils
const isNotNilAndEmpty = value => !isNil(value) && !isEmpty(value);
const isNilOrEmpty = value => isNil(value) || isEmpty(value);

const getTransformationsForLevel = (vdrLevel, vdrkey, accountId, instanceId) => {
  switch (vdrLevel) {
    case 'organizations': 
      return get(`${vdrLevel}/objects/${vdrkey}/transformations`);
    case 'accounts': 
      return get(`${vdrLevel}/${accountId}/objects/${vdrkey}/transformations`);
    case 'instances': 
      return get(`${vdrLevel}/${instanceId}/transformations/${vdrkey}`);
    default: 
      return null;
  }
}

const getObjectDefinitionsUrl = (vdrLevel, instanceId) => equals(vdrLevel, 'instances')
  ? `${vdrLevel}/${instanceId}/objects/definitions` 
  : `${vdrLevel}/objects/definitions`;

const getVdrsObjectsTransformations = async (vdrName, vdrLevel, accountId, instanceId) => {
  let finalTransformationObject = {};
  let transformationList = [];
  let transformationsForElementKey = [];
  const vdrsKeys = [vdrName]//keys(objectDefinitions);
  const transformationPromiseList = isNotNilAndEmpty(vdrsKeys)
    ? vdrsKeys.map(vdrkey => getTransformationsForLevel(vdrLevel, vdrkey, accountId, instanceId))
    : Promise.resolve([]);
  await Promise.all(transformationPromiseList)
    .then(response => {
      return transformationList.push(response)
    })
    .catch(error => {
      throw error;
    });
  if (equals(vdrLevel, 'instances')) {
    const instanceTransformation = head(flatten(transformationList));
    // TODO: We have to use instance by id from instanceTransformation
    return {'instance': instanceTransformation};
  }
  let elementKeyList = isNotNilAndEmpty(transformationList) ? 
    flatten(transformationList).map(transformation => pipe(prop('element'), prop('key'))(transformation))
    : [];
  elementKeyList = isNotNilAndEmpty(elementKeyList) ? uniq(elementKeyList) : [];
  const transformationsPromiseListForElementKey = isNotNilAndEmpty(elementKeyList)
    ? elementKeyList.map(elementKey => equals(vdrLevel, 'accounts') && isNotNilAndEmpty(accountId)
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
    isNotNilAndEmpty(elementKeyList) && elementKeyList.forEach((elementKey, index) => {
      return finalTransformationObject[elementKey] = transformationsForElementKey[index][vdrName];
    });
    return finalTransformationObject;
}

const getData = async (vdrName, vdrLevel, account, instance) => {
  // Determine what needs to be done here
  // 1. Should return only organizations vdrs?
  // 2. Should return only accounts vdrs?
  // 3. Should return both organizations and accounts vdrs?
  if (isNotNilAndEmpty(vdrName) && isNotNilAndEmpty(vdrLevel)) {
    const objectDefinitionsUrl = getObjectDefinitionsUrl(vdrLevel, instance);
    const objectDefinitions = await get(objectDefinitionsUrl);
    const objectTransformations = await getVdrsObjectsTransformations(vdrName, vdrLevel, account, instance);
    if(isNilOrEmpty(objectDefinitions) && isNilOrEmpty(objectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      objectName: vdrName,
      objectDefinitions: objectDefinitions[vdrName],
      transformations: objectTransformations
    }

  } else if (isNotNilAndEmpty(vdrName) && isNilOrEmpty(vdrLevel)) {
    const organizationsObjectDefinitions = await get(`organizations/objects/definitions`);
    const organizationsObjectTransformations = await getVdrsObjectsTransformations(vdrName, 'organizations');
    
    const accountsObjectDefinitions = await get(`accounts/objects/definitions`);
    const accountsObjectTransformations = await getVdrsObjectsTransformations(vdrName, 'accounts', account);
    
    const instancesObjectDefinitions = await get(`instances/${instance}/objects/definitions`);
    const instancesObjectTransformations = await getVdrsObjectsTransformations(vdrName, 'instances', null, instance);
    
    if(isNilOrEmpty(organizationsObjectDefinitions) && isNilOrEmpty(organizationsObjectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      objectName: vdrName,
      objectDefinitions: [
        organizationsObjectDefinitions[vdrName],
        accountsObjectDefinitions[vdrName],
        instancesObjectDefinitions[vdrName]
      ],
      transformations: uniq([
        organizationsObjectTransformations,
        accountsObjectTransformations,
        instancesObjectTransformations
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
