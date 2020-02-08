'use strict';

const { prop, forEach, pipe, __} = require('ramda')
const getExecutionDataToExport = require('./getExecutionDataToExport')
const getExecution = require('../util/getExecution')
const saveExecutionToFile = require('../util/saveExecutionToFile')
const saveToDir = require('../util/saveFormulasToDir');
const saveTo = require('./saveTo')
const makeMessage = name => `Saved Execution: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))

module.exports = async params => {
    return saveTo(getExecutionDataToExport(getExecution, params.options.name), log, saveExecutionToFile, saveToDir)(params)
}
