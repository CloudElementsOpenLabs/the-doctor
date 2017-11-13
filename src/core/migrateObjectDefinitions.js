'use strict';

const getObjectDefinitions = require('./getObjectDefinitions');
const postObjectDefinitions = require('./postObjectDefinitions');
const deleteObjectDefinitions = require('./deleteObjectDefinitions');
const {curry, pipeP, __} = require('ramda');

module.exports = curry(async (from, to) => {
  await deleteObjectDefinitions(to);
  pipeP(
    getObjectDefinitions,
    postObjectDefinitions(to)
  )(from);
});