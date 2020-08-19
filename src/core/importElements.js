'use strict';
const {pipe, pipeP, cond, prop, isNil, not, useWith, type, equals, isEmpty, find, toLower, __, curry} = require('ramda');
const readFile = require('../util/readFile');
const buildElementsFromDir = require('../util/buildElementsFromDir');
const createElements = require('../util/createElements');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const importElements = curry(async (elements, options) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Service - It will be in Array of objects containing elementKey and private flag structure
  let elementsToImport = [];
  if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
    const elementKeys = Array.isArray(options.name)
      ? options.name.map((element) => element.key)
      : options.name.split(',');
    elementKeys &&
      elementKeys.forEach((elementKey) => {
        const elementToImport = find((element) => toLower(element.key) === toLower(elementKey))(elements);
        if (isNilOrEmpty(elementToImport)) {
          console.log(`The doctor was unable to find the element ${elementKey}.`);
        } else {
          elementsToImport.push(elementToImport);
        }
      });
  }
  elementsToImport = isNilOrEmpty(elementsToImport) ? elements : elementsToImport
  await createElements(elementsToImport, options.jobId, options.processId);
});

module.exports = options => cond([
  [
    pipe(prop('file'), isNil, not),
    pipeP(
      useWith(readFile, [prop('file')]),
      cond([
        [pipe(type, equals('Object')) && pipe(prop('elements'), isNil, not), pipe(prop('elements'), importElements(__, options))],
        [pipe(type, equals('Array')), importElements(__, options)],
      ]),
    ),
  ],
  [pipe(prop('dir'), isNil, not), pipeP(useWith(buildElementsFromDir, [prop('dir')]), importElements(__, options))],
])(options);
