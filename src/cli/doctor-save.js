'use strict';

const commander = require('commander');
const functions = {
    objectDefinitions: require('../core/saveObjectDefinitions'),
    transformations: require('../core/saveTransformationsToFile')
}

const save = (object, environment, options) => {
    if (!functions[object]) {
        console.log('Command not found: %object', object);
        process.exit(1);
    }
    try {
        functions[object](environment, options.file);
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
    console.log('    $ doctor save objectDefinitions staging');
    console.log('    $ doctor save formulas production -f ~/Desktop/formulas-production.json');
    console.log('    $ doctor save transformations production');
    console.log('');
  })
  .parse(process.argv);