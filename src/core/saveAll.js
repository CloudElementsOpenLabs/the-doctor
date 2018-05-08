'use strict';

const {pipeP, curry, objOf} = require('ramda');
const getFormulas = require('../util/getFormulas');
const findTransformations = require('../util/findTransformations');
const get = require('../util/get');
const getFormulasInstances = () => get('formulas/instances');
const getElements = require('../util/getElements');
const save = require('../util/save');

module.exports = async (parms) => {
    const backup = {
        formulas: await get(`formulas`),
        transformations: await findTransformations(),
        objectDefinitions: await get(`organizations/objects/definitions`),
        formulasInstances: await getFormulasInstances(),
        elements: await getElements()
    };
    save(parms, backup);
};
