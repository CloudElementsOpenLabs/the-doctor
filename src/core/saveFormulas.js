'use strict';

const {pipeP, curry} = require('ramda');
const getFormulas = require('../util/getFormulas');

module.exports = (environment, options) => {
    const fileName = options.file;
    
    return pipeP(
        getFormulas,
        saveToFile(fileName)
    )(environment);
};