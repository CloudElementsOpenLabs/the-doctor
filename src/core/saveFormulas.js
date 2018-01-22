'use strict';

const {pipeP, curry} = require('ramda');
const getFormulas = require('../util/getFormulas');
const saveToFile = require('../util/saveToFile');

module.exports = async (environment, options) => {
    const fileName = options.file;
    
    return await pipeP(
        getFormulas,
        saveToFile(fileName)
    )(environment);
};