'use strict';

const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const {curry, test} = require('ramda');

module.exports = curry(async (path) => {
  console.log('process.env.BASE_URL - GET', process.env.BASE_URL)
  
  let options = {
    json: true,
    headers: {
        Authorization: authHeader(),
    },
    url: baseUrl(path),
    method: "GET",
    strictSSL: false
  };
  try {
    return await rp(options);
  } catch (err) {
    if (test(/^No (.*) found$/, err.error.message)) {
      return {}
    } else {
      throw err
    }
  }
});