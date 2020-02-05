'use strict';

const { curry } = require('ramda');

 module.exports = curry((getData) => async (id)=> await getData(id))
