const {pipe, apply, curry} = require('ramda');

module.exports = curry(async(f, then, params) => {
  await apply(f, params);
  return await apply(then, params)
});