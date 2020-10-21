'use strict';
require('log-prefix')(() => `[${new Date().toISOString()}] Doctor-core: %s`);
const {type} = require('ramda');
const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner');
const {removeCancelledJobId} = require('../events/cancelled-job');
const clearCancelledJobId = (jobId) => jobId && removeCancelledJobId(jobId);

const functions = {
  commonResources: require('./removeCommonResources'),
  vdrs: require('./removeCommonResources'),
  formulaInstances: require('./removeFormulaInstances'),
  instances: require('./removeInstances'),
  elements: require('./removeElements'),
  formulas: require('./removeFormulas'),
};
const specificFunctions = {
  elements: require('./removeElement'),
  formulas: require('./removeFormula'),
  vdrs: require('./removeCommonResource'),
  commonResources: require('./removeCommonResource'),
};

const validateObject = (object, functions) => {
  if (!functions[object]) {
    console.log('Command not found: %o', object);
    process.exit(1);
  }
};

module.exports = async (object, account, options) => {
  await loadAccount(account);
  try {
    await startSpinner();
    if (options.name !== undefined && type(options.name) !== 'Function') {
      validateObject(object, specificFunctions);
      await specificFunctions[object](options);
    } else {
      validateObject(object, functions);
      await functions[object]();
    }
    clearCancelledJobId(options.jobId)
    await stopSpinner();
  } catch (err) {
    clearCancelledJobId(options.jobId)
    await stopSpinner();
    throw err;
  }
};
