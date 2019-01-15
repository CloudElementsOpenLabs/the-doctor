'use strict';

const {prop, pipeP, map, pipe, tap} = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const makePath = id => `formulas/${id}`;
const makeMessage = name => `Deleted Formula: ${name}.`
const log = map(pipe(prop('name'), makeMessage, console.log))

module.exports = pipeP(
    getFormulas,
    tap(log),
    map(
        pipe(
            prop('id'),
            makePath, 
            remove
        )
    )
);
