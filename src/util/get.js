'use strict';

const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const {curry} = require('ramda');

module.exports = curry(async (path, env) => {
  let options = {
    json: true,
    headers: {
        Authorization: authHeader(env),
    },
    url: baseUrl(path, env),
    method: "GET"
  };
  return await rp(options);
});