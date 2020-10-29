'use strict';

const {curry} = require('ramda');
const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');

module.exports = curry(async (path, body) => {
  let options = {
    json: true,
    headers: {
        Authorization: authHeader(),
    },
    url: baseUrl(path),
    method: "POST",
    strictSSL: false,
    body: body
  };
  try {
    return (await rp(options));
  } catch (err) {
    console.error(`Failed to create ${path} with name ${body ? body.name : body}. \n${err.message}`);
    throw err;
  }
});