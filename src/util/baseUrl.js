'use strict';

const {curry} = require('ramda');
const production = 'production';

module.exports = (path) => `${process.env.BASE_URL}/elements/api-v2/${path}`;