'use strict';

const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');

module.exports = async (path) => {
  let options = {
    json: true,
    headers: {
        Authorization: authHeader(),
    },
    url: baseUrl(path),
    method: "DELETE"
  };
  try {
    return (await rp(options));
  } catch (err) {
    console.error(err.message);
  }
}