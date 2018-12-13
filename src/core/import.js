'use strict';

const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner')
const importCommonResources = require('../core/importCommonResources')
const functions = {
    commonResources: importCommonResources,
    vdr: importCommonResources,
    formulas: require('../core/importFormulas'),
    elements: require('../core/importElements'),
    all: require('../core/importBackup')
}

module.exports = async (object, account, options) => {
    await loadAccount(account)
    if (!functions[object]) {
        console.log('Command not found: %o', object)
        process.exit(1)
    }
    if (!options.file && !options.dir) {
        console.log('Please specify a file or directory to save with -f / -d')
        process.exit(1)
    }
    try {
        await startSpinner()
        await functions[object](options)
        await stopSpinner()
    } catch (err) {
        console.log("Failed to complete operation: ", err)
    } 
};