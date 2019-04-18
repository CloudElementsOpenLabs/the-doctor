'use strict';

const {pipe, prop, forEach} = require('ramda')
const getDataToExport = require('./getDataToExport')
const getElements = require('../util/getElements')
const saveToFile = require('../util/saveToFile')
const saveToDir = require('../util/saveElementsToDir')
const saveTo = require('./saveTo')
const makeMessage = name => `Saved Element: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))


//(parms)
module.exports = saveTo(getDataToExport(getElements), log, saveToFile, saveToDir)
