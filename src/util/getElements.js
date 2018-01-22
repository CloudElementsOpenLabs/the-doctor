'use strict';

const get = require('./get');
const {curry, map, is, ifElse, __} = require('ramda');

const makePath = (elementKey) => `elements/${elementKey}`;

module.exports = curry(async (env, elementKeys) => {
    return pipeP(
        map(makePath),
        map({__: get(__, env)})
    )(elementKeys);
});