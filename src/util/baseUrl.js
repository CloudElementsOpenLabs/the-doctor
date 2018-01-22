'use strict';

const {curry} = require('ramda');
const production = 'production';

module.exports = curry((path, env) => {
  return env === production ? `https://console.cloud-elements.com/elements/api-v2/${path}` : `https://staging.cloud-elements.com/elements/api-v2/${path}`;
});