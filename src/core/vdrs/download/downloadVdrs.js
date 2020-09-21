'use strict';
const {forEachObjIndexed, pipeP, __} = require('ramda');
const getData = require('./getVdrs');
const applyVersion = require('../../../util/applyVersion');
const saveTo = require('../../saveTo');
const saveToFile = require('../../../util/saveToFile');
const {saveVdrsToDirNew, saveVdrsToDirOld} = require('./saveVdrsToDir');
const log = (data) => forEachObjIndexed((object, key) => console.log(`Saved VDR: ${key}`))(data);

module.exports = (params) => {
  try {
    const saveToFolder = Object.prototype.hasOwnProperty.call(params.options, 'useNew')
      ? saveVdrsToDirNew
      : saveVdrsToDirOld;
    if (Object.prototype.hasOwnProperty.call(params.options, 'version')) {
      params.options.name = `${params.options.name}_${params.options.version}`;
    }
    return saveTo(pipeP(getData, applyVersion(__, params)), log, saveToFile, saveToFolder)(params);
  } catch (error) {
    console.log('Failed to complete VDR operation: ', error.message);
    throw error;
  }
};
