'use strict';
const {pipe, pipeP, cond, prop, isNil, not, useWith} = require('ramda');
const importElements = require('./importElements');
const importVdrs = require('./vdrs/upload/uploadMultipleVdrs');
const importFormulas = require('./importFormulas');
const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');
const createFormulas = require('../util/createFormulas');
const createElements = require('../util/createElements');
const readFile = require('../util/readFile');

const importBackupFromFile = async (fileData) => {
  await createElements(fileData.elements);
  createObjectDefinitions(fileData).then(() => {
    createTransformations(fileData);
  });
  await createFormulas(fileData.formulas);
};

const importBackupFromDir = async (parms) => {
  await importElements({...parms, dir: `${parms.dir}/elements`});
  await importVdrs({...parms, dir: `${parms.dir}/vdrs`});
  await importFormulas({...parms, dir: `${parms.dir}/formulas`});
};

module.exports = cond([
  [pipe(prop('file'), isNil, not), pipeP(useWith(readFile, [prop('file')]), importBackupFromFile)],
  [pipe(prop('dir'), isNil, not), importBackupFromDir],
]);
