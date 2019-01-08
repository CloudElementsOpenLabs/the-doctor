'use strict'

const commander = require('commander')
const save = require('../core/export')

commander
  .command('object [account]', 'object')
  .option("-f, --file [file]", "location of file to save objects")
  .option("-d, --dir [dir]", "location of directory to save objects")
  .option("-n, --name [name]", "name of specific object to be download")
  .action((object, account, options) => save(object, account, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor download commonResources staging -f ~/Desktop/commonResources-staging.json')
    console.log('    $ doctor download formulas production -f ~/Desktop/formulas-production.json -d ~/Desktop/formulas')
    console.log('    $ doctor download elements dev -f ~/Desktop/elements-production.json')
    console.log('    $ doctor download all personalAccount -f ~/Desktop/production-backup-1-21-18.json')
    console.log('    $ doctor download formulas production -d ~/Desktop/formulas -n formula-name')
    console.log('    $ doctor download elements dev -f ~/Desktop/elements-production.json -n element-name')
    console.log('')
  })
  .parse(process.argv)