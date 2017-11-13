'use strict'; 

const migrateODs = require('./migrateObjectDefinitions');
const saveODsToFile = require('./saveObjectDefinitionsToFile');
const {curry, pipeP, toLower} = require('ramda');

module.exports = async (from, to) => {
  const fileName = `${toLower(to)}_objectDefinitions_backup.json`;
  await saveODsToFile(to, fileName);
  await migrateODs(from, to);
};