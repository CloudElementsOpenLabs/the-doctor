'use strict';

const get = require('./get');

module.exports = (id) => get(`formulas/instances/executions/${id}`);
