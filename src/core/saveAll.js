'use strict';

const {pipeP, curry, objOf} = require('ramda');
const getFormulas = require('../util/getFormulas');
const findTransformations = require('../util/findTransformations');
const getObjectDefinitions = require('../util/getObjectDefinitions');
const getFormulasInstances = require('../util/get')('formulas/instances');
const saveToFile = require('../util/saveToFile');

module.exports = async (fileName, env) => {
    const backup = {
        formulas: await getFormulas(env),
        transformations: await findTransformations(env),
        objectDefinitions: await getObjectDefinitions(env),
        formulasInstances: await getFormulasInstances(env)
    };
    saveToFile(fileName, backup);
};