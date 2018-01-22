'use strict';

const {curry, pipeP, map, prop} = require('ramda');
const getInstances = require('../util/getInstances');
const remove = require('../util/remove');
const makePath = id => `instances/${id}`;

module.exports = env => {
    const removeInstance = remove(env);
    pipeP(
        getInstances,
        map(prop('id')),
        map(makePath),
        map(removeInstance)
    )(env);
}
