'use strict';

const { type } = require('ramda');
const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner')

const functions = {
    commonResources: require('../core/importCommonResources'),
    vdrs: require('../core/importCommonResources'),
    formulas: require('../core/importFormulas'),
    elements: require('../core/importElements'),
    all: require('../core/importBackup')
}

const specificFunctions = {
    formulas: require('./importFormula'),
    elements: require('./importElement'),
    commonResources: require('./importCommonResource'),
    vdrs: require('./importCommonResource')
}

const validateObject = (object, functions) => {
    if (!functions[object]) {
        console.log('Command not found: %o', object)
        process.exit(1)
    }
}

module.exports = async (object, account, options) => {
    await loadAccount(account)
    
    if (!options.file && !options.dir) {
        console.log('Please specify a file or directory to save with -f / -d')
        process.exit(1)
    }
    try {
        await startSpinner()
        if(options.name !== undefined && type(options.name) !== 'Function') {
            validateObject(object, specificFunctions)
            await specificFunctions[object](options)
        } else {
            validateObject(object, functions)
            await functions[object](options)
        }
        await stopSpinner()
    } catch (err) {
        console.log("Failed to complete operation: ", err)
        await stopSpinner()
        process.exit(1)
    } 
};