'use strict';

const getObjectDefinitions = require('../util/getObjectDefinitions');
const postObjectDefinitions = require('../util/postObjectDefinitions');
const deleteObjectDefinitions = require('../util/deleteObjectDefinitions');
const to = require('../lens/to');
const from = require('../lens/from');
const {curry, pipeP, composeP} = require('ramda');

module.exports = pipeP(
  composeP(getObjectDefinitions, from),
  composeP(postObjectDefintions, to)
);

let migrateObjectDefinitions = doThen(deleteObjectDefinitions, sendObjectDefinitions);