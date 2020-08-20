'use strict';
const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner');
const eventListener = require('../events/event-listener');

const functions = {
  vdrs: require('./vdrs/upload/uploadMultipleVdrs'),
  formulas: require('../core/importFormulas'),
  elements: require('../core/importElements'),
  all: require('../core/importBackup'),
};

module.exports = async (object, account, options) => {
  await loadAccount(account);
  if (!options.file && !options.dir) {
    console.log('Please specify a file or directory to save with -f / -d');
    process.exit(1);
  } else if (!functions[object]) {
    console.log('Command not found: %o', object);
    process.exit(1);
  }
  eventListener.addListener();
  try {
    await startSpinner();
    await functions[object](options);
    await stopSpinner();
  } catch (err) {
    console.log('Failed to complete operation: ', err);
    await stopSpinner();
    throw err;
  }
};
