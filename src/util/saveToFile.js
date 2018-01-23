'use strict';

const {curry} = require('ramda');
const fs = require('fs');

module.exports = curry(async (fileName, data) => {
  fs.writeFileSync(fileName, JSON.stringify((await data), null, 2), 'utf8')
});
