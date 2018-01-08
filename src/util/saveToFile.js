'use strict';

const {curry} = require('ramda');
const fs = require('fs');

const writeFile = curry(async (fileName, data) => {
  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, JSON.stringify(data, null, 2), 'utf8', function(err) {
        if (err) reject(err);
        else resolve(data);
    });
  });
});
module.exports = curry(async (fileName, data) => {
  console.log(fileName, data);
  try {
    return await writeFile(fileName, await data);
  } catch (err) {
    console.log(err);
  }
})