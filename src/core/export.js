'use strict';
const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner');
const eventListener = require('../events/event-listener');

const functions = {
  vdrs: require('./vdrs/download/downloadVdrs'),
  formulas: require('../core/saveFormulas'),
  elements: require('../core/saveElements'),
  all: require('../core/saveAll'),
};

module.exports = async (object, account, options) => {
  try {
    await startSpinner();
    await loadAccount(account);
    if (!options.file && !options.dir) {
      console.log('Please specify a file to save with -f or a directory to save with -d');
      process.exit(1);
    } else if (!functions[object]) {
      console.log('Command not found: %o', object);
      process.exit(1);
    }
    eventListener.addListener();
    await functions[object]({object, options});
    await stopSpinner();
  } catch (err) {
    await stopSpinner();
    throw err;
  }
};
