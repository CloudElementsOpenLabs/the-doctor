'use strict';
const {map, find, propEq} = require('ramda');
const get = require('./get');
const createformula = require('./post')('formulas');
const makePath = formula => `formulas/${formula.id}`;
const update = require('./update');

module.exports = async (formulas) => {
    let endpointFormulas = await get('formulas');
    map(async formula => {
        let endpointFormula = find(propEq('name' ,formula.name))(endpointFormulas);
        if(endpointFormula) {
            await update(makePath(endpointFormula), formula);
        } else {
            await createFormula(formula);
        }
    })(formulas);
}

