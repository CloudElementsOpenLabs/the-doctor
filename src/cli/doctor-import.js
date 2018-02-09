'use strict';

const commander = require('commander');
const loadAccount = require('../util/loadAccount');
const functions = {
    commonResources: require('../core/importCommonResources'),
    formulas: require('../core/importFormulas'),
    elements: require('../core/importElements'),
    all: require('../core/importBackup')
}

const importBackup = async (object, account, options) => {
    await loadAccount(account);

    if (!functions[object]) {
        console.log('Command not found: %o', object);
        process.exit(1);
    }
    if (!options.file) {
        console.log('Please specify a file to save with -f');
        process.exit(1);
    }
    try {
        functions[object](options.file);
    } catch (err) {
        console.log("Failed to complete operation: ", err);
    }
};

commander
  .command('object [account]', 'object')
  .option("-f, --file [file]", "location of file to load objects from")
  .action((object, account, options) => importBackup(object, account, options))
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ doctor import commonResources staging -f ~/Desktop/objectDefinitions-staging.json');
    console.log('    $ doctor import formulas production -f ~/Desktop/formulas-production.json');
    console.log('    $ doctor import elements dev -f ~/Desktop/elements-production.json');
    console.log('    $ doctor import all personalAccount -f ~/Desktop/production-backup-1-21-18.json');
    console.log('');
  })
  .parse(process.argv);