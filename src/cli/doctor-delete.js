'use strict'

const commander = require('commander')
const loadAccount = require('../util/loadAccount')
const functions = {
    commonResources: require('../core/removeCommonResources'),
    formulaInstances: require('../core/removeFormulaInstances'),
    instances: require('../core/removeInstances'),
    elements: require('../core/removeElements'),
    formulas: require('../core/removeFormulas')
}

const remove = async (object, account, options) => {
    await loadAccount(account)

    if (!functions[object]) {
        console.log('Command not found: %o', object)
        process.exit(1)
    }
    try {
        functions[object]()
    } catch (err) {
        console.log("Failed to complete operation: ", err)
    }
}

commander
  .command('object [account]', 'object')
  .action((object, account, options) => remove(object, account, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor delete commonResources personalAccount')
    console.log('    $ doctor delete formulas production')
    console.log('    $ doctor delete instances staging')
    console.log('    $ doctor delete formulaInstances dev')
    console.log('    $ doctor delete elements dev')
    console.log('')
  })
  .parse(process.argv)