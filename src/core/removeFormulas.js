'use strict';

const {compose, prop} = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const makePath = id => `formulas/${id}`;
const idProp = prop('id');

module.exports = remove(getFormulas, idProp, makePath);