if (process.env.ENVIRONMENT != 'PROD') {
  require('dotenv').config({ path: './config/props.env' });
}

const production = 'PRODUCTION';
const staging = 'STAGING';
const saveObjectDefinitionsToFile = require('./src/core/saveObjectDefinitionsToFile');
const saveTransformationsToFile = require('./src/core/saveTransformationsToFile');
const getObjectDefinitions = require('./src/core/getObjectDefinitions');
const saveToFile = require('./src/core/saveToFile');
const migrateODsWithBackup = require('./src/core/migrateObjectDefinitionsWithBackup');
const migrateObjectDefinitions = require('./src/core/migrateObjectDefinitions');

// saveObjectDefinitionsToFile(production, 'productionObjectDefinitions.json').catch(err => console.error(err));
// saveTransformationsToFile(staging, ['sfdc', 'quickbooks']).then(r => console.log(r)).catch(err => console.error(err));
// migrateODsWithBackup(staging, production).then(r => console.log(r)).catch(err => console.error(err));
migrateObjectDefinitions(staging, production).then(r => console.log(r)).catch(err => console.error(err));