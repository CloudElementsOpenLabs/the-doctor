'use strict'

const commander = require('commander')
const importBackup = require('../core/import')

commander
  .command('object [account]', 'object')
  .option("-f, --file [file]", "location of file to load objects from")
  .option("-d, --dir [dir]", "location of directory to load objects from")
  .option("-n, --name [name]", "name of specific entity or multiple comma-separated entities to be import")
  .action((object, account, options) => importBackup(object, account, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor import vdrs staging -f ~/Desktop/vdrs-staging.json')
    console.log('    $ doctor import vdrs staging -n vdr1,vdr2,vdr3 -D ~/Desktop/vdrs/')
    console.log('    $ doctor import formulas production -f ~/Desktop/formulas-production.json')
    console.log('    $ doctor import elements dev -f ~/Desktop/elements-production.json')
    console.log('    $ doctor import all personalAccount -f ~/Desktop/production-backup-1-21-18.json')
    console.log('    $ doctor import formulas production -d ~/Desktop/formulas -n formula-name')
    console.log('    $ doctor import elements dev -f ~/Desktop/elements-production.json -n element-name')
    console.log('')
  })
  .parse(process.argv)