'use strict';

const {converge, identity} = require('ramda');
const getFormulas = require('../util/getFormulas');
const save = require('../util/save');

//(parms)
module.exports = converge(
    save, [
      identity,
      getFormulas
    ]
  )