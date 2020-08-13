const { type } = require('ramda');
const loadAccount = require('../util/loadAccount')
const {startSpinner, stopSpinner} = require('../util/spinner')


const functions = {
    commonResources: require('./removeCommonResources'),
    vdrs : require('./removeCommonResources'),
    formulaInstances: require('./removeFormulaInstances'),
    instances: require('./removeInstances'),
    elements: require('./removeElements'),
    formulas: require('./removeFormulas')
}
const specificFunctions = {
    elements: require('./removeElement'),
    formulas: require('./removeFormula'),
    vdrs: require('./removeCommonResource'),
    commonResources: require('./removeCommonResource')
}

const validateObject = (object, functions) => {
    if (!functions[object]) {
        console.log('Command not found: %o', object)
        process.exit(1)
    }
}

module.exports = async (object, account, options) => {
    await loadAccount(account)
    try {
        await startSpinner()
        if(options.name !== undefined && type(options.name) !== 'Function') {
            validateObject(object, specificFunctions)
            await specificFunctions[object](options)
        } else {
            validateObject(object, functions)
            await functions[object]()
        }
        await stopSpinner()
    } catch (err) {
        console.log("Failed to complete operation: ", err)
        process.exit(1)
    }
}