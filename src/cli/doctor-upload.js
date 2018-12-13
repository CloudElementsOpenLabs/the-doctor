'use strict'

const commander = require('commander')
const importBackup = require('../core/import')

commander
  .command('object [account]', 'object')
  .option("-f, --file [file]", "location of file to load objects from")
  .option("-d, --dir [dir]", "location of directory to load objects from")
  .action((object, account, options) => importBackup(object, account, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor upload commonResources staging -f ~/Desktop/objectDefinitions-staging.json')
    console.log('    $ doctor upload formulas production -f ~/Desktop/formulas-production.json')
    console.log('    $ doctor upload elements dev -f ~/Desktop/elements-production.json')
    console.log('    $ doctor upload all personalAccount -f ~/Desktop/production-backup-1-21-18.json')
    console.log('')
  })
  .parse(process.argv)