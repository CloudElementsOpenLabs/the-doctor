'use strict'; 

const getTransformation = require('./getTransformation');
const getTransformations = require('./getTransformations');
const getObjectDefinition = require('./getObjectDefinition');
const deleteTransformation = require('./deleteTransformation');
const deleteObjectDefinition = require('./deleteObjectDefintion');
const createTransformation = require('./createTransformation');
const createObjectDefinition = require('./createObjectDefinition');
const {map, curry, pipeP, keys, prop} = require('ramda');

module.exports = async (from, to, elementKeys) => {
  //get all transformations(from), delete them(to), get all objectDefintions(from), delete them (to), create object definitions to, create transformations to
  map(key => {
    let transformations = await getTransformations(from, key);
    let objectDefinitions = await getObjectDefinition(from, );
    map(transformation => await deleteTransformation(to, key, prop(transformation, transformations)), keys(transformations));
    map(objectDefinitions)
    await deleteTransformation(to, key, )
  });
};