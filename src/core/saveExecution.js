'use strict';

const { prop, forEach, pipe, __} = require('ramda')
const getExecutionDataToExport = require('./getExecutionDataToExport')
const getExecution = require('../util/getExecution')
const saveExecutionToFile = require('../util/saveExecutionToFile')
const saveToDir = require('../util/saveFormulasToDir');
const saveTo = require('./saveTo')

const log = (execution) => { 
    if(execution.id) return console.log(`Saved Execution: ${execution.id}.`) 
    else return console.log(`No execution data found.`)
} 

module.exports = params => {
    return saveTo(getExecutionDataToExport(getExecution, params.options.name), log, saveExecutionToFile, saveToDir)(params)
}
