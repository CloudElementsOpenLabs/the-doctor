'use strict'

const commander = require('commander')
const save = require('../core/export')

commander
  .command('object [account]', 'object')
  .option("-f, --file [file]", "location of file to save objects")
  .option("-d, --dir [dir]", "location of directory to save objects")
  .option("-u, --useNew [useNew]", "folder structure to use for download")
  .option("-n, --name [name]", "name of specific object to be export")
  .action((object, account, options) => save(object, account, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor export vdrs staging -f ~/Desktop/vdrs-staging.json')
    console.log('    $ doctor export formulas production -d ~/Desktop/formulas')
    console.log('    $ doctor export elements dev -f ~/Desktop/elements-production.json')
    console.log('    $ doctor export all personalAccount -f ~/Desktop/production-backup-1-21-18.json')
    console.log('    $ doctor export formulas production -d ~/Desktop/formulas -n formula-name')
    console.log('    $ doctor export elements dev -f ~/Desktop/elements-production.json -n element-name')
    console.log('')
  })
  .parse(process.argv)