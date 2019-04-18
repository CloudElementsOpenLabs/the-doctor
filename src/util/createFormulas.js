'use strict';
const {map, find, propEq, mergeAll, curry, pipeP} = require('ramda');
const get = require('./get');
const postFormula = require('./post')('formulas');
const applyVersion = require('../util/applyVersion')
const makePath = formula => `formulas/${formula.id}`;
const update = require('./update');

const createFormula = curry(async (endpointFormulas,formula) => {
    const endpointFormula = find(propEq('name' ,formula.name))(endpointFormulas)
    if(endpointFormula) {
        return { [formula.id]: endpointFormula.id }
    } else {
        const result = await postFormula(formula)
        console.log(`Created Formula: ${formula.name}`)
        return { [formula.id]: result.id }
    }
})

const updateFormula = async formula => {
    await update(makePath(formula), formula)
    console.log(`Updated Formula: ${formula.name}`)
}

module.exports = async (formulas) => {
    const endpointFormulas = await get('formulas')
    let formulaIds = mergeAll(await Promise.all(map(createFormula(endpointFormulas))(formulas)))
    const fixSteps = map(s => s.type === 'formula'? ({ ...s, properties: { formulaId: formulaIds[s.properties.formulaId] } }) : s)
    const newFormulas = map(f => ({
            ...f,
            id: formulaIds[f.id],
            steps: fixSteps(f.steps),
            subFormulas: f.subFormulas ? map(s => ({
                    ...s, 
                    id: formulaIds[s.id],
                    steps: fixSteps(s.steps)
                }))(f.subFormulas) : []
            }))(formulas)
    return Promise.all(map(updateFormula)(newFormulas))
}