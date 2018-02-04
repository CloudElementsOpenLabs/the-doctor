'use strict';

const {compose, prop} = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const makePath = id => `formulas/${id}`;

module.exports = pipeP(
    getFormulas,
    map( 
        prop('id'),
        makePath, 
        remove
    )
);
