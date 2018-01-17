'use strict';

const {curry} = require('ramda');
const fs = require('fs');

module.exports = curry(async (fileName, data) => {
  fs.writeFile(fileName, JSON.stringify(data, null, 2), 'utf8')
});
