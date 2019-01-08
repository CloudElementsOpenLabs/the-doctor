'use strict';

const {pipe, prop, forEach} = require('ramda')
const getDataToExport = require('./getDataToExport')
const getFormulas = require('../util/getFormulas')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveFormulasToDir');
const saveTo = require('./saveTo')
const makeMessage = name => `Saved Formula: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))

//(parms)
module.exports = saveTo(getDataToExport(getFormulas), log, saveToFile, saveToDir)