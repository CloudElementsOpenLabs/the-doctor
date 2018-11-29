'use strict';

const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const {curry, test} = require('ramda');

module.exports = curry(async (path) => {
  let options = {
    json: true,
    headers: {
        Authorization: authHeader(),
    },
    url: baseUrl(path),
    method: "GET",
    strictSSL: false,
    secureProtocol: 'TLSv1_method'
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