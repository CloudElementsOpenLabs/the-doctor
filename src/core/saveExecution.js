'use strict';

const { curry, prop, forEach, pipe, __} = require('ramda')
const getExecutionDataToExport = require('./getExecutionDataToExport')
const getExecution = require('../util/getExecution')
const applyVersion = require('../util/applyVersion')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveFormulasToDir');
const saveTo = require('./saveTo')
const makeMessage = name => `Saved Execution: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))


//(parms)
module.exports = async params => {
    // let execution = await getExecutionDataToExport(getExecution, params.options.name);
    // getExecutionDataToExport(getExecution, params.options.name), applyVersion(__, params))
    return saveTo(getExecutionDataToExport(getExecution, params.options.name), log, saveToFile, saveToDir)(params)
}
