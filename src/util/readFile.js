'use strict';

const {curry} = require('ramda');
const fs = require('fs');

module.exports = curry((fileName) => {
  return JSON.parse(fs.readFileSync(fileName));
});
