'use strict';

const { curry } = require('ramda');

 module.exports = curry((getExecution) => async (id)=> await getExecution(id))
