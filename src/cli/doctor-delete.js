'use strict';

const commander = require('commander');
const functions = {
    objectDefinitions: require('../core/saveObjectDefinitions'),
    transformations: require('../core/saveTransformations'),
    formulas: require('../core/saveFormulas')
}

const remove = (object, environment, options) => {
    if (!functions[object]) {
        console.log('Command not found: %o', object);
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
  .option("-k, --keys [...keys]", "elementKeys to save transformations for")
  .action((object, environment, options) => remove(object, environment, options))
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ doctor save objectDefinitions staging');
    console.log('    $ doctor save formulas production -f ~/Desktop/formulas-production.json');
    console.log('    $ doctor save transformations production');
    console.log('');
  })
  .parse(process.argv);