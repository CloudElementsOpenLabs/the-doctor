'use strict'

const commander = require('commander')

const functions = {
    add: require('../core/addAccount'),
    list: require('../core/listAccounts'),
    remove: require('../core/removeAccount')
}

const accounts = (operation, options) => {
    if (!functions[operation]) {
        console.log('Command not found: %o', operation)
        process.exit(1)
    }
    if (operation === 'add' && (!options.userSecret || !options.orgSecret)) {
        console.log('include userSecret and orgSecret for this operation')
        process.exit(1)
    }
    if (operation === 'remove' && !options.name) {
        console.log('include name for this operation')
        process.exit(1)
    }
    try {
        functions[operation](options)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

commander
  .command('operation', 'operation')
  .option("-n, --name [name]", "Nickname of the account")
  .option("-u, --userSecret [userSecret]", "User Secret for this account")
  .option("-o, --orgSecret [orgSecret]", "Organization Secret for this account")
  .option("-b, --baseUrl [baseUrl]", "baseUrl for the account")

  .action((operation, options) => accounts(operation, options))
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ doctor accounts add -n devStaging -u awuhusdfwlekfjs -o elrigusvbdsvirf -b https://staging.cloud-elements.com')
    console.log('    $ doctor accounts list')
    console.log('    $ doctor accounts remove -n devStaging')
    console.log('')
  })
  .parse(process.argv)
