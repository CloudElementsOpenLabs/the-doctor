'use strict';
const {curry} = require('ramda');
const fs = require('fs');

module.exports = curry(async (fileName, data) => {
  try {
    fs.writeFileSync(fileName, JSON.stringify(await data, null, 2), 'utf8');
  } catch (error) {
    throw error;
  }
});
