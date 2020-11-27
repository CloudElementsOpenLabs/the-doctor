'use strict';
const getDataToExport = require('./getDataToExport');
const getElements = require('../util/getElements');
const saveToFile = require('../util/saveToFile');
const saveToDir = require('../util/saveElementsToDir');
const saveTo = require('./saveTo');

module.exports = (params) => {
  try {
    return saveTo(getDataToExport(getElements), saveToFile, saveToDir)(params);
  } catch (error) {
    console.log('Failed to complete element operation: ', error.message);
    throw error;
  }
};
