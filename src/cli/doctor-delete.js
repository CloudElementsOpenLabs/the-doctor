'use strict';

const commander = require('commander');
const functions = {
    commonResources: require('../core/removeCommonResources'),
    formulaInstances: require('../core/removeFormulaInstances'),
    instances: require('../core/removeInstances'),
    elements: require('../core/removeElements'),
    formulas: require('../core/removeFormulas')
}

const remove = (object, environment, options) => {
    process.env.ENV = environment;
    if (!functions[object]) {
        console.log('Command not found: %o', object);
        process.exit(1);
    }
    try {
        functions[object]();
    } catch (err) {
        console.log("Failed to complete operation: ", err);
    }
};

commander
  .command('object [environment]', 'object')
  .action((object, environment, options) => remove(object, environment, options))
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ doctor delete objectDefinitions staging');
    console.log('    $ doctor delete formulas production');
    console.log('    $ doctor delete transformations production');
    console.log('    $ doctor delete formulaInstances productionw');
    console.log('');
  })
  .parse(process.argv);