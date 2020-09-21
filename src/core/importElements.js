'use strict';
const {
  pipe,
  pipeP,
  cond,
  prop,
  isNil,
  not,
  useWith,
  type,
  equals,
  isEmpty,
  find,
  toLower,
  __,
  curry,
  has,
} = require('ramda');
const readFile = require('../util/readFile');
const buildElementsFromDir = require('../util/buildElementsFromDir');
const createElements = require('../util/createElements');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const importElements = curry(async (elements, options) => {
  try {
    // From CLI - User can pass comma seperated string of elements key
    // From Service - It will be in Array of objects containing elementKey and private flag structure
    let elementsToImport = [];
    if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
      const elementKeys = Array.isArray(options.name) ? options.name : options.name.split(',');
      elementKeys &&
        elementKeys.forEach((elementKey) => {
          if (equals(type(elementKey), 'Object') && !isNilOrEmpty(options.jobId)) {
            const {key} = elementKey;
            const elementToImport = find((element) =>
              equals(toLower(element.key), toLower(key))
                ? elementKey.private
                  ? has('private', element) && element.private
                  : has('private', element)
                  ? !element.private && element.extended
                  : element.extended
                : false,
            )(elements);
            if (isNilOrEmpty(elementToImport)) {
              console.log(`The doctor was unable to find the element ${key}.`);
            } else {
              elementsToImport.push(elementToImport);
            }
          } else {
            const elementToImport = find((element) => equals(toLower(element.key), toLower(elementKey)))(elements);
            if (isNilOrEmpty(elementToImport)) {
              console.log(`The doctor was unable to find the element ${elementKey}.`);
            } else {
              elementsToImport.push(elementToImport);
            }
          }
        });
    }
    elementsToImport = isNilOrEmpty(elementsToImport) ? elements : elementsToImport;
    await createElements(elementsToImport, options.jobId, options.processId);
  } catch (error) {
    throw error;
  }
});

module.exports = (options) => {
  try {
    return cond([
      [
        pipe(prop('file'), isNil, not),
        pipeP(
          useWith(readFile, [prop('file')]),
          cond([
            [
              pipe(type, equals('Object')) && pipe(prop('elements'), isNil, not),
              pipe(prop('elements'), importElements(__, options)),
            ],
            [pipe(type, equals('Array')), importElements(__, options)],
          ]),
        ),
      ],
      [pipe(prop('dir'), isNil, not), pipeP(useWith(buildElementsFromDir, [prop('dir')]), importElements(__, options))],
    ])(options);
  } catch (error) {
    console.log('Failed to complete element operation: ', error.message);
    throw error;
  }
};
