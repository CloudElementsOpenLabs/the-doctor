'use strict';

const get = require('../util/get');
const getElements = () => get('elements');
const remove = require('../util/remove');
const {filter, pipe, pipeP, propEq, prop, map, tap} = require('ramda');
const makePath = (id) => `elements/${id}`;

module.exports = pipeP(
    getElements, 
    filter(propEq('private', true)),
    map(
        pipe(
            prop('id'),
            makePath,
            remove
        )
    )
);