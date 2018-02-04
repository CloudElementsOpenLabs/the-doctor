require('dotenv').config({path: './config.env'});
const R = require('ramda');
const createFormulas = require('./src/core/importFormulas');

process.env.ENV = 'production';

createFormulas('/Users/calebgeene/Desktop/formulas-production.json');
