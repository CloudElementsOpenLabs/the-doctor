'use strict';

const {pipeP, __} = require('ramda')
const getFormulas = require('../util/getFormulas')
const applyVersion = require('../util/applyVersion')

//(parms)
module.exports = params => {
    if (params.options.hasOwnProperty('version')){
        params.options.name = params.options.name + '_' + params.options.version
    }
    return pipeP(converge(getFormulas, [ pipe(prop('options'), prop('name'))]), applyVersion(__, params));
}
