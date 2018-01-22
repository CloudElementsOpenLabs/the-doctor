'use strict';

const {pipeP, curry, objOf} = require('ramda');
const getFormulas = require('../util/getFormulas');
const findTransformations = require('../util/findTransformations');
const getObjectDefinitions = require('../util/getObjectDefinitions');
const saveToFile = require('../util/saveToFile');

module.exports = async (environment, options) => {
    const fileName = options.file;
    
    const backup = {
        formulas: await getFormulas(environment),
        transformations: await findTransformations(environment),
        objectDefinitions: await getObjectDefinitions(environment)
    };
    saveToFile(fileName, backup);
};