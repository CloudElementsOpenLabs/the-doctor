'use strict';
const fetch = require('isomorphic-fetch');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const {isNil, startsWith} = require('ramda');

const parseJsonSafe = jsonString => {
    try {
      return JSON.parse(jsonString);
    } catch(ignore) {
      return {};
    }
  };
const isTextJson = text => !isNil(text) && (startsWith(text, '{') || startsWith(text, '['));
const parseBody = response => response.text().then(text => (isTextJson(text) ? parseJsonSafe(text) : text));


module.exports = (url, method, options) => {
  const endpoint = baseUrl(url);
  const fetchOptions = {
    ...options,
    json: true,
    method: method,
    headers: {
        Authorization: authHeader(),
    },
    strictSSL: false,
  };

  return fetch(endpoint, fetchOptions)
    .then(response => {
        const parsedBody = parseBody(response);
        return Promise.all([response, parsedBody]);
    })
    .catch(error => {
        if (test(/^No (.*) found$/, error.message)) {
            return {}
          } else {
            throw error
          }    
    });
}