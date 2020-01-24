'use strict';

const {pipe, prop, map, forEach} = require('ramda')
const getFormulas = require('../util/getFormulas')
const findTransformations = require('../util/findTransformations')
const get = require('../util/get')
const getElements = require('../util/getElements')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveBackupToDir')
const saveTo = require('./saveTo')

const makeMessage = (object) => name => `Saved ${object}: ${name}.`
const log = (object, propName) => map(pipe(prop(propName), makeMessage(object), console.log))

const logAll = async data => {
    const elements = await data.elements
    log('Element','name')(elements)
    const objects = await data.objectDefinitions
    log('Object','objectName')(objects)
    const transformations = await data.transformations
    forEach(element => {
        forEach(transformation => {
          console.log(`Saved Transformation: ${prop('objectName',transformation)} - ${element}.`)
        })(transformations[element])
      })(transformations)
    const formulas = await data.formulas
    log('Formula','name')(formulas)
}

const getData = async () => {
    return {
        formulas: await getFormulas(),
        transformations: await findTransformations(),
        objectDefinitions: await get(`organizations/objects/definitions`,""),
        elements: await getElements()
    }
  }

//(parms)
module.exports = saveTo(getData, logAll, saveToFile, saveToDir)
