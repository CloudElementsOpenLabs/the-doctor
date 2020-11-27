'use strict';
const {pipeP, __} = require('ramda');
const getDataToExport = require('./getDataToExport');
const getFormulas = require('../util/getFormulas');
const applyVersion = require('../util/applyVersion');
const saveToFile = require('../util/saveToFile');
const saveToDir = require('../util/saveFormulasToDir');
const saveTo = require('./saveTo');

module.exports = (params) => {
  try {
    if (Object.prototype.hasOwnProperty.call(params.options, 'version')) {
      params.options.name = params.options.name + '_' + params.options.version;
    }
    return saveTo(pipeP(getDataToExport(getFormulas), applyVersion(__, params)), saveToFile, saveToDir)(params);
  } catch (error) {
    console.log('Failed to complete formula operation: ', error.message);
    throw error;
  }
};
