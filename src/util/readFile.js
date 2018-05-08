'use strict';

const fs = require('fs');

module.exports = async(fileName) => {
  return new Promise((resolve, reject) => resolve(JSON.parse(fs.readFileSync(fileName))));
};
