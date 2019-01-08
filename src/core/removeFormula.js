'use strict';

const {prop, pipeP, map, pipe, tap, forEach, filter, toLower, equals, isEmpty} = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const makePath = id => `formulas/${id}`;
const makeMessage = name => `Deleted Formula: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))

const getFormula = async name => {
    const formulas = await getFormulas()
    const formula = filter(pipe(prop('name'), toLower, equals(toLower(name))), formulas)
    if(isEmpty(formula)) console.log(`The doctor was unable to find the formula ${name}.`)
    return formula
}

module.exports = pipe(
    prop('name'),
    pipeP(
        getFormula,
        tap(log),
        map(
            pipe(
                prop('id'),
                makePath, 
                remove
            )
        )
    )
);
