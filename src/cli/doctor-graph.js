'use strict'

const commander = require('commander')
const functions = {
    formulas: require('../core/graphFormulas')
}

const remove = async (object, options) => {

    if (!functions[object]) {
        console.log('Command not found: %o', object)
        process.exit(1)
    }
    try {
        await functions[object](options)
    } catch (err) {
        console.log("Failed to complete operation: ", err)
        process.exit(1)
    }
}

commander
  .command('object', 'object')
  .option("-f, --file [file]", "location of the workflow file")
  .action((object, options) => remove(object, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor graph formulas -f ~/Desktop/doctor/formula.json')
    console.log('')
  })
  .parse(process.argv)