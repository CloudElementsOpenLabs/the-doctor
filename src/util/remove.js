'use strict';

const {curry, pipeP, map, __} = require('ramda');
const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');

const call = async (path, env) => {
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
}
//(object to retrieve, function to get the ID, function to generate delete path, env)
module.exports = curry(async (retrieve, lens, makePath, env) => {
  pipeP(
    retrieve,
    map(lens),
    map(makePath),
    map(call(__, env))
  )(env);
});