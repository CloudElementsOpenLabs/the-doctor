'use strict';

const {curry} = require('ramda');
const fs = require('fs');

module.exports = curry((fileName, data) => {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8')
});
