'use strict';

const commander = require('commander');

const save = (object, environment) => {
    console.log(object + ' ' + environment);
};

commander
  .command('object [environment]', 'object')
  .action((object, environment) => save(object, environment))
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ doctor save objectDefinitions staging');
    console.log('    $ doctor save formulas production');
    console.log('    $ doctor save transformations production');
    console.log('');
  })
  .parse(process.argv);