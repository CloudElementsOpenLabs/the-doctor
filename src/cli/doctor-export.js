'use strict';

const commander = require('commander');
const loadAccount = require('../util/loadAccount');
const functions = {
    commonResources: require('../core/saveCommonResources'),
    formulas: require('../core/saveFormulas'),
    elements: require('../core/saveElements'),
    all: require('../core/saveAll')
}

const save = async (object, account, options) => {
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
  .option("-f, --file [file]", "location of file to save objects")
  .action((object, account, options) => save(object, account, options))
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ doctor export commonResources staging -f ~/Desktop/commonResources-staging.json');
    console.log('    $ doctor export formulas production -f ~/Desktop/formulas-production.json');
    console.log('    $ doctor export elements dev -f ~/Desktop/elements-production.json');
    console.log('    $ doctor export all personalAccount -f ~/Desktop/production-backup-1-21-18.json');
    console.log('');
  })
  .parse(process.argv);