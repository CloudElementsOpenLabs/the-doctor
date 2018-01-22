'use strict';

const {compose, prop, curry, pipeP} = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const getFormulaInstances = require('../util/get')(;
const makePath = curry((formulaId, instanceId) => `formulas/${formulaId}/instances/${instanceId}`);
const idProp = prop('id');

// (env)
const formulasDeletePaths = pipeP(
    getFormulas,
    map(idProp),
    map(makePath)
);

// (env)
module.exports = env => pipeP(
    formulasDeletePaths,
    map(remove(getFormulaInstances, idProp, __, env))
)(env);
