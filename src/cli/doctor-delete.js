'use strict'

const commander = require('commander')
const remove = require('../core/delete');

commander
  .command('object [account]', 'object')
  .option("-n, --name [name]", "name of specific object to be deleted")
  .action((object, account, options) => remove(object, account, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor delete vdrs personalAccount')
    console.log('    $ doctor delete formulas production')
    console.log('    $ doctor delete instances staging')
    console.log('    $ doctor delete formulaInstances dev')
    console.log('    $ doctor delete elements dev')
    console.log('    $ doctor delete formulas dev -n formulaName')
    console.log('')
  })
  .parse(process.argv)