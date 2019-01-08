'use strict';

const remove = require('./remove');

module.exports = async name => await remove(`organizations/objects/${name}/definitions`);