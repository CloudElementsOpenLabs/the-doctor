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
    // TODO: Replace instance transformation API with instance by id API
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

const getData = async (vdrName, vdrLevel, accountId, instanceId) => {

  if (isNilOrEmpty(vdrName)) {
    console.log(`The doctor could not find any VDR name, add a VDR name after -n to download`);
    return;
  }

  if (vdrLevel === 'account' && isNilOrEmpty(vdrLevel) && isNilOrEmpty(accountId)) {
    console.log(`The doctor could not find any account id, add an account id after -a to download`);
    return;
  }

  if (vdrLevel === 'instance' && isNilOrEmpty(vdrLevel) && isNilOrEmpty(instanceId)) {
    console.log(`The doctor could not find any instance id, add an instance id after -a to download`);
    return;
  }

  if (isNotNilAndEmpty(vdrName) && isNotNilAndEmpty(vdrLevel) && (!(vdrLevel)== 'all')) {
    const objectDefinitionsUrl = getObjectDefinitionsUrl(vdrLevel, instanceId);
    const objectDefinitions = await get(objectDefinitionsUrl);
    const objectTransformations = await getVdrsObjectsTransformations(vdrName, vdrLevel, accountId, instanceId);
    if(isNilOrEmpty(objectDefinitions) && isNilOrEmpty(objectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      objectName: vdrName,
      objectDefinitions: objectDefinitions[vdrName],
      transformations: objectTransformations
    }

  } else if (isNotNilAndEmpty(vdrName) && vdrLevel == 'all') {
    const organizationsObjectDefinitions = await get(`organizations/objects/definitions`);
    const organizationsObjectTransformations = await getVdrsObjectsTransformations(vdrName, 'organizations');
    
    const accountsObjectDefinitions = await get(`accounts/objects/definitions`);
    const accountsObjectTransformations = await getVdrsObjectsTransformations(vdrName, 'accounts', accountId);
    
    const instancesObjectDefinitions = await get(`instances/${instanceId}/objects/definitions`);
    const instancesObjectTransformations = await getVdrsObjectsTransformations(vdrName, 'instances', null, instanceId);
    
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
      ])
    }

  } else if (isNotNilAndEmpty(vdrName) && isNilOrEmpty(vdrLevel)) {
    const organizationsObjectDefinitions = await get(`organizations/objects/definitions`);
    const organizationsObjectTransformations = await getVdrsObjectsTransformations(vdrName, 'organizations');
        
    if(isNilOrEmpty(organizationsObjectDefinitions) && isNilOrEmpty(organizationsObjectTransformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return;
    }
    return {
      objectName: vdrName,
      objectDefinitions: [
        organizationsObjectDefinitions[vdrName]
      ],
      transformations: uniq([
        organizationsObjectTransformations
      ])
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
