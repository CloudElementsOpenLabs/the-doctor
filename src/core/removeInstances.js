'use strict';

const {curry, pipeP, map, prop} = require('ramda');
const get = require('../util/get');
const getInstances = () => get('instances');
const remove = require('../util/remove');
const makePath = id => `instances/${id}`;

module.exports = pipeP(
    getInstances, 
    map(
        pipe(
            makePath, 
            remove
        )
    )
)
