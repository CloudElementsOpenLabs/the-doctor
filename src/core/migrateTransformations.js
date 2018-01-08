'use strict'; 

const getTransformation = require('../util/getTransformation');
const getTransformations = require('../util/getTransformations');
const getObjectDefinition = require('../util/getObjectDefinition');
const deleteTransformation = require('../util/deleteTransformation');
const deleteObjectDefinition = require('../util/deleteObjectDefintion');
const createTransformation = require('../util/createTransformation');
const createObjectDefinition = require('../util/createObjectDefinition');
const {map, curry, pipeP, keys, prop} = require('ramda');

module.exports = async (from, to, elementKeys) => {
  //get all transformations(from), delete them(to), get all objectDefintions(from), delete them (to), create object definitions to, create transformations to
  map(key => {
    const transformations = await getTransformations(from, elementKeys);
    const objectDefinitions = await getObjectDefinition(from);
    map(transformation => await deleteTransformation(to, key, transformation), keys(transformations));
    await deleteObjectDefinitions(to);
    await createObjectDefinitions(to, objectDefinitions);
    await createTransformations()
  });
};


let transformations = {
  sfdc: {
    myContact: {

    }
  }
}