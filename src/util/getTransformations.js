'use strict';

const get = require('./get');
const {curry, map, is, ifElse, __} = require('ramda');

const makePath = (elementKey) => `organizations/elements/${elementKey}/transformations`;

module.exports = curry(async (env, elementKeys) => {
    return pipeP(
        map(makePath),
        map({__: get(__, env)})
    )(elementKeys);
});