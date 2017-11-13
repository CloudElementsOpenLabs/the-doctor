'use strict';

const {always, contains, ifElse, pipe, prop, __} = require('ramda');
const accept = [200];

module.exports = pipe(
  prop('StatusCodeError'),
  ifElse(contains(__, accept), always(false), always(true))
);