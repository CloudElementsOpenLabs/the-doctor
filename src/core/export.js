'use strict';

const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner')

const functions = {
    commonResources: require('../core/saveCommonResources'),
    vdrs: require('./vdrs/download/downloadVdrs'),
    formulas: require('../core/saveFormulas'),
    elements: require('../core/saveElements'),
    all: require('../core/saveAll')
}

module.exports = async (object, account, options) => {
    await loadAccount(account)

    if (!functions[object]) {
        throw new Error('Command not found: %o', object);
    }
    try {
        await startSpinner()
        return await functions[object]({object, options})
    } catch (err) {
        console.log("Failed to complete operation: ", err.message)
    }finally {
        await stopSpinner()
    }
}
