'use strict';

const {pipeP, forEachObjIndexed, isEmpty} = require('ramda');
const readFile = require('../util/readFile');
const buildResourcesFromDir = require('../util/buildCommonResourcesFromDir');
const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');

//(fileName)
module.exports = async options => {
  const vdrNames = options.name.split(',')
  let data = options.file ? await readFile(options.file) : await buildResourcesFromDir(options.dir)
  vdrNames.forEach(async (vdrName) => {
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
