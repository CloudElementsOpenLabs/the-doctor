'use strict';

const getTransformations = require('./getTransformations');
const saveToFile = require('./saveToFile');
const isError = require('./isError');
const {curry, pipeP, map, ifElse, isEmpty, identity, toLower} = require('ramda');

module.exports = curry(async (env, elementKeys) => {
  map(key => pipeP(
    getTransformations(env),
    ifElse(isEmpty, identity, saveToFile(`${toLower(env)}_${key}_transformation.json`))
  )(key), elementKeys);
});
