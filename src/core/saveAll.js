'use strict';

const {pipeP, curry, objOf} = require('ramda');
const getFormulas = require('../util/getFormulas');
const findTransformations = require('../util/findTransformations');
const get = require('../util/get');
const getFormulasInstances = () => get('formulas/instances');
const getElements = require('../util/getElements');
const saveToFile = require('../util/saveToFile');

module.exports = async (fileName) => {
    const backup = {
        formulas: await get(`formulas`),
        transformations: await findTransformations(),
        objectDefinitions: await get(`organizations/objects/definitions`),
        formulasInstances: await getFormulasInstances(),
        elements: await getElements()
    };
    saveToFile(fileName, backup);
};