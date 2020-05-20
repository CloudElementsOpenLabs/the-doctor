'use strict';

const {map, pipe, converge, prop, curry, pipeP, tap} = require('ramda');
const remove = require('../util/remove');
const get = require('../util/get');
const getFormulaInstances = () => get('formulas/instances',"");
const makePath = curry((formulaId, instanceId) => `formulas/${formulaId}/instances/${instanceId}`);

module.exports = pipeP(
    getFormulaInstances, 
    map(
        pipe(
            converge(makePath, [
                pipe(prop('formula'), prop('id')),
                prop('id')
            ]),
            remove
        )
    )
);