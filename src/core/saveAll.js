'use strict';

const {pipe, pipeP, tap, prop, map, curry, objOf, keys} = require('ramda');
const getFormulas = require('../util/getFormulas');
const findTransformations = require('../util/findTransformations');
const get = require('../util/get');
const getFormulasInstances = () => get('formulas/instances');
const getElements = require('../util/getElements');
const save = require('../util/save');

const makeMessage = (object) => name => `Saved ${object}: ${name}.`
const log = (object, propName) => map(pipe(prop(propName), makeMessage(object), console.log))

module.exports = async (parms) => {
    let elements = await getElements()
    log('Element','name')(elements)
    let objects = await get(`organizations/objects/definitions`)
    log('Object','objectName')(objects)
    let transformations = await findTransformations()
    map(element => {
        map(transformation => {
          console.log(`Saved Transformation: ${prop('objectName',transformation)} - ${element}.`)
        })(transformations[element])
      })(keys(transformations))
    let formulas = await getFormulas()
    log('Formula','name')(formulas)
   
    const backup = {
        formulas: formulas,
        transformations: transformations,
        objectDefinitions: objects,
        formulasInstances: await getFormulasInstances(),
        elements: elements
    };
    save(parms, backup);
};
