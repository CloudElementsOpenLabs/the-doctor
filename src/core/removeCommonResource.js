'use strict';

const {type, forEachObjIndexed} = require('ramda');
const deleteTransformations = require('../util/deleteTransformations');
const deleteObjectDefinition = require('../util/deleteObjectDefinition')
const findTransformations = require('../util/findTransformations');

const getTransformations = async (objectName) => {
    const endpointTransformations = await findTransformations()
    //Specific object delete
    if(objectName !== undefined && type(objectName) !== 'Function') {
      let transformations = {}
      forEachObjIndexed((element,elementKey) => {
        if(element[objectName] !== undefined) {
          transformations[elementKey] = {}
          transformations[elementKey][objectName] = element[objectName]
        }
      })(endpointTransformations)
      return transformations
    }
    return endpointTransformations
  }

module.exports = async options => {
    const transformations = await getTransformations(options.name)
    await deleteTransformations(transformations)
    await deleteObjectDefinition(options.name)
}