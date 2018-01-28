'use strict';

const {curry} = require('ramda');
const fs = require('fs');

module.exports = curry(async (fileName) => {
  return fs.readFileSync(fileName, , {encoding: 'utf8'});
});
