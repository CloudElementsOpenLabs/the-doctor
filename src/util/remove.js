'use strict';

const {curry} = require('ramda');
const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');

module.exports = curry(async (env, path) => {
  let options = {
    json: true,
    headers: {
        Authorization: authHeader(env),
    },
    url: baseUrl(path, env),
    method: "DELETE"
  };
  try {
    return (await rp(options));
  } catch (err) {
    console.log(err);
  }
});