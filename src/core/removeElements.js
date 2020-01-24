'use strict';

const getElements = require('../util/getElements')
const remove = require('../util/remove');
const {filter, pipe, pipeP, propEq, prop, map, tap} = require('ramda');
const makePath = (id) => `elements/${id}`;
const makeMessage = name => `Deleted Element: ${name}.`
const log = map(pipe(prop('name'), makeMessage, console.log))

module.exports = pipeP(
    getElements, 
    filter(propEq('private', true)),
    tap(log),
    map(
        pipe(
            prop('id'),
            makePath,
            remove
        )
    )
);