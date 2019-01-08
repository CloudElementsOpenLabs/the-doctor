'use strict';

const get = require('../util/get');
const getElements = () => get('elements');
const remove = require('../util/remove');
const {filter, pipe, pipeP, propEq, prop, map, isEmpty, tap, forEach, toLower, equals} = require('ramda');
const makePath = id => `elements/${id}`;
const makeMessage = name => `Deleted Element: ${name}.`
const log = forEach(pipe(prop('name'), makeMessage, console.log))

const getElement = async name => {
    const elements = await getElements()
    const element = filter(pipe(prop('name'), toLower, equals(toLower(name))), elements)
    if(isEmpty(element)) console.log(`The doctor was unable to find the element ${name}.`)
    return element
}

module.exports = pipe(
    prop('name'),
    pipeP(getElement, 
        filter(propEq('private', true)),
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