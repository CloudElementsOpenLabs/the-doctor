'use strict';

const {prop, pipeP, map, pipe, tap} = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const makePath = id => `formulas/${id}`;

module.exports = pipeP(
    getFormulas,
    map(
        pipe(
            prop('id'),
            makePath, 
            remove
        )
    )
);
