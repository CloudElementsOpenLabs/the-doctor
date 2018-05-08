'use strict';

const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const {curry} = require('ramda');

module.exports = curry(async (path) => {
  let options = {
    json: true,
    headers: {
        Authorization: authHeader(),
    },
    url: baseUrl(path),
    method: "GET"
  };
  return await rp(options);
});