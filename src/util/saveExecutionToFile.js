'use strict';

const {curry} = require('ramda');
const fs = require('fs');
const get = require('./get');
const getStepValues = require('./getStepValues');

module.exports = curry(async (fileName, data) => {
  let executionWithStepValues = await getStepValues(await data);
  fs.writeFileSync(fileName, JSON.stringify(executionWithStepValues, null, 2), 'utf8')
});