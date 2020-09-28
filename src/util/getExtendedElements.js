'use strict';
const {join, map, isNil, isEmpty, flatten, pipe, filter, type} = require('ramda');
const get = require('./get');
const applyQuotes = require('./quoteString');
const getExtendedElements = (qs) => get('elements', qs);
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

module.exports = async (keys, jobId) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  const extendedElementsKey = !isNilOrEmpty(keys)
    ? Array.isArray(keys)
      ? pipe(
          filter((element) => !element.private),
          map((element) => element.key),
          flatten,
          join(','),
        )(keys)
      : type(keys) === 'String'
      ? keys
      : []
    : [];

  // For CLI, if elements keys are empty then default the qs to true
  // For Doctor-service, if any private or extended keys are empty then don't make API call
  const extended_qs = isNilOrEmpty(extendedElementsKey)
    ? isNilOrEmpty(jobId)
      ? {where: "extended='true'"}
      : ''
    : {where: "extended='true' AND key in (" + applyQuotes(extendedElementsKey) + ')'};
  try {
    const allExtendedElements = !isNilOrEmpty(extended_qs) ? await getExtendedElements(extended_qs) : [];
    return !isNilOrEmpty(allExtendedElements)
      ? allExtendedElements.filter((element) => element.extended && !element.private)
      : []; 
  } catch (error) {
    throw error;
  }
};
