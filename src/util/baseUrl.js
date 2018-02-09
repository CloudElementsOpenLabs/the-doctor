'use strict';

const {curry} = require('ramda');
const production = 'production';

module.exports = () => process.env.BASE_URL;