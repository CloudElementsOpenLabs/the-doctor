'use strict';

const {converge, pipe, prop, forEach} = require('ramda')
const getElements = require('../util/getElements')

//(parms)
module.exports =  converge(getElements, [ pipe(prop('options'), prop('name'))])

