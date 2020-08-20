'use strict';

const {pipe, prop, forEach, pipeP, __} = require('ramda')
const getDataToExport = require('./getDataToExport')
const getFormulas = require('../util/getFormulas')
const applyVersion = require('../util/applyVersion')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveFormulasToDir');
const saveTo = require('./saveTo')
const makeMessage = name => `Saved Formula: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))

//(parms)
module.exports = params => {
    if (Object.prototype.hasOwnProperty.call(params.options, 'version')){
        params.options.name = params.options.name + '_' + params.options.version
    }
    return saveTo(pipeP(getDataToExport(getFormulas), applyVersion(__, params)), log, saveToFile, saveToDir)(params)
}
