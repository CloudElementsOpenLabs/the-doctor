'use strict';

const get = require('../util/get');
const getElements = () => get('elements');
const remove = require('../util/remove');
const {filter, pipe, pipeP, equals, prop} = require('ramda');
const makePath = (id) => `elements/${id}`;

module.exports = pipeP(
    getElements, 
    filter(equals(prop('private'), true)), 
    map(
        pipe(
            makePath,
            remove
        )
    )
);