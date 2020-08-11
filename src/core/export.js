'use strict';

const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner')
const eventListener = require('../events/event-listener');

const functions = {
    commonResources: require('../core/saveCommonResources'),
    vdrs: require('./vdrs/download/downloadVdrs'),
    formulas: require('../core/saveFormulas'),
    elements: require('../core/saveElements'),
    all: require('../core/saveAll')
}

module.exports = async (object, account, options) => {
    await loadAccount(account)
    eventListener.addListener();

    if (!functions[object]) {
        console.log('Command not found: %o', object)
        process.exit(1)
    }
    if (!options.file && !options.dir) {
        console.log('Please specify a file to save with -f or a directory to save with -d')
        process.exit(1)
    }
    try {
        await startSpinner()
        await functions[object]({object, options})
        await stopSpinner()
    } catch (err) {
        console.log("Failed to complete operation: ", err.message)
        await stopSpinner()
        throw err;
    }
}
