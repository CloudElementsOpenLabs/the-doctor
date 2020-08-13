'use strict';

const { join, map, isNil, isEmpty, flatten, pipe, filter, type } = require('ramda');
const get = require('./get')
const applyQuotes = require('./quoteString');

const getPrivateElements = (qs) => get('elements', qs);
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

module.exports = async (keys) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  const privateElementsKey = !isNilOrEmpty(keys)
    ? Array.isArray(keys)
      ? pipe(
        filter((element) => element.private),
        map((element) => element.key),
        flatten,
        join(', '),
      )(keys)
      : type(keys) === 'String'
        ? keys
        : []
    : [];

  const private_qs = isNilOrEmpty(privateElementsKey)
    ? { where: "private='true'" }
    : { where: "private='true' AND key in (" + applyQuotes(privateElementsKey) + ')' };

  return await getPrivateElements(private_qs);
};