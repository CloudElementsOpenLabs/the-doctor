'use strict';

const getObjectDefinitions = require('./getObjectDefinitions');
const saveToFile = require('./saveToFile');
const {pipe, prop, converge} = require('ramda');

module.exports = converge(saveToFile, [
  prop('fileName'),
  pipe(prop('from'), getObjectDefinitions)
]);
