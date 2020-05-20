'use strict';

const {pipeP, map, prop, pipe} = require('ramda');
const get = require('../util/get');
const getInstances = () => get('instances',"");
const remove = require('../util/remove');
const makePath = id => `instances/${id}`;

module.exports = pipeP(
    getInstances, 
    map(
        pipe(
            prop('id'),
            makePath, 
            remove
        )
    )
)
