'use strict';

const {pipeP, forEachObjIndexed, isEmpty} = require('ramda');
const readFile = require('../util/readFile');
const buildResourcesFromDir = require('../util/buildCommonResourcesFromDir');
const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');

//(fileName)
module.exports = async options => {
  // From CLI - User can pass comma seperated string of vdrs name
  // From Doctor-service - It will be in Array of objects containing vdr name
  const vdrNames = Array.isArray(options.name)
    ? options.name.map((vdr) => vdr.name)
    : options.name.split(',');
  let data = options.file ? await readFile(options.file) : await buildResourcesFromDir(options.dir)
  vdrNames && vdrNames.forEach(async (vdrName) => {
    let transformations = {}
    forEachObjIndexed((element, elementKey) => {
      if (element[vdrName] !== undefined) {
        transformations[elementKey] = {}
        transformations[elementKey][vdrName] = element[vdrName]
      }
    })(data.transformations)
    data.objectDefinitions = data.objectDefinitions[vdrName] ? {[vdrName]: data.objectDefinitions[vdrName]} : {}
    data.transformations = transformations

    if (!data.objectDefinition && isEmpty(data.transformations)) {
      console.log(`The doctor was unable to find any vdr called ${vdrName}`)
      return
    }
    await pipeP(createObjectDefinitions, createTransformations)(data)
  })
}
