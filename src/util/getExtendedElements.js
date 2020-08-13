'use strict';

const { join, map, isNil, isEmpty, flatten, pipe, filter, type } = require('ramda');
const get = require('./get')
const applyQuotes = require('./quoteString');
const getPrivateElements = require('./getPrivateElements');

const getExtendedElements = (qs) => get('elements', qs);
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

module.exports = async (keys) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  const extendedElementsKey = !isNilOrEmpty(keys)
    ? Array.isArray(keys)
      ? pipe(
        filter((element) => !element.private),
        map((element) => element.key),
        flatten,
        join(', '),
      )(keys)
      : type(keys) === 'String'
        ? keys
        : []
    : [];

  const extended_qs = isNilOrEmpty(extendedElementsKey)
    ? { where: "extended='true'" }
    : { where: "extended='true' AND key in (" + applyQuotes(extendedElementsKey) + ')' };

  const allExtendedElements = await getExtendedElements(extended_qs);

  const privateElements = await getPrivateElements(keys);
  const privateElementIds = map((e) => e.id, privateElements);

  const extendedELements = allExtendedElements.filter((element) => !privateElementIds.includes(element.id));
  return extendedELements;
};