'use strict';

const {pipe, prop, forEach, pipeP, __} = require('ramda')
const getExecutionDataToExport = require('./getExecutionDataToExport')
const getExecution = require('../util/getExecution')
const applyVersion = require('../util/applyVersion')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveFormulasToDir');
const saveTo = require('./saveTo')
const makeMessage = name => `Saved Execution: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))

//(parms)
module.exports = params => {
    return saveTo(pipeP(getExecutionDataToExport(getExecution, undefined, params.options.name), applyVersion(__, params)), log, saveToFile, saveToDir)(params)
}