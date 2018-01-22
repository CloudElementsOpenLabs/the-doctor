'use strict';

const commander = require('commander');
const functions = {
    objectDefinitions: require('../core/saveObjectDefinitions'),
    transformations: require('../core/saveTransformations'),
    formulas: require('../core/saveFormulas'),
    formulaInstances: require('../core/saveFormulaInstances'),
    all: require('../core/saveAll')
}

const save = (object, environment, options) => {
    if (!functions[object]) {
        console.log('Command not found: %o', object);
        process.exit(1);
    }
    if (!options.file) {
        console.log('Please specify a file to save with -f');
        process.exit(1);
    }
    try {
        functions[object](environment, options);
    } catch (err) {
        console.log("Failed to complete operation: ", err);
    }
};

commander
  .command('object [environment]', 'object')
  .option("-f, --file [file]", "location of file to save objects")
  .action((object, environment, options) => save(object, environment, options))
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ doctor save objectDefinitions staging -f ~/Desktop/objectDefinitions-staging.json');
    console.log('    $ doctor save formulas production -f ~/Desktop/formulas-production.json');
    console.log('    $ doctor save transformations production -f ~/Desktop/transformations-production.json');
    console.log('    $ doctor save all production -f ~/Desktop/production-backup-1-21-18.json');
    console.log('');
  })
  .parse(process.argv);