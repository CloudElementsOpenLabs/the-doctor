'use strict'

const { type } = require('ramda');
const commander = require('commander')
const loadAccount = require('../util/loadAccount')
const {startSpinner, stopSpinner} = require('../util/spinner')

const functions = {
    commonResources: require('../core/removeCommonResources'),
    vdr : require('../core/removeCommonResources'),
    formulaInstances: require('../core/removeFormulaInstances'),
    instances: require('../core/removeInstances'),
    elements: require('../core/removeElements'),
    formulas: require('../core/removeFormulas')
}
const specificFunctions = {
    elements: require('../core/removeElement'),
    formulas: require('../core/removeFormula'),
    vdr: require('../core/removeCommonResource'),
    commonResources: require('../core/removeCommonResource')
}

const validateObject = (object, functions) => {
    if (!functions[object]) {
        console.log('Command not found: %o', object)
        process.exit(1)
    }
}

const remove = async (object, account, options) => {
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

commander
  .command('object [account]', 'object')
  .option("-n, --name [name]", "name of specific object to be deleted")
  .action((object, account, options) => remove(object, account, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor delete commonResources personalAccount')
    console.log('    $ doctor delete formulas production')
    console.log('    $ doctor delete instances staging')
    console.log('    $ doctor delete formulaInstances dev')
    console.log('    $ doctor delete elements dev')
    console.log('    $ doctor delete formulas dev -n formulaName')
    console.log('')
  })
  .parse(process.argv)