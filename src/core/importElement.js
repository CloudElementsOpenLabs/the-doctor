'use strict';

const {find, toLower, type, isNil, isEmpty} = require('ramda');
const readFile = require('../util/readFile');
const buildElementsFromDir = require('../util/buildElementsFromDir');
const createElements = require('../util/createElements');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const createElement = async (options, elements) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  let elementsToImport = [];
  if (!isNilOrEmpty(options.name)) {
    const elementKeys = Array.isArray(options.name)
      ? options.name.map((element) => element.key)
      : options.name.split(',');
    elementKeys &&
      elementKeys.forEach((elementKey) => {
        const elementToImport = find((element) => toLower(element.key) === toLower(elementKey))(elements);
        if (isNilOrEmpty(elementToImport)) {
          console.log(`The doctor was unable to find the element ${ename}.`);
        } else {
          elementsToImport.push(elementToImport);
        }
    });
    if (!isNilOrEmpty(elementsToImport)) {
      await createElements(elementsToImport, options.jobId, options.processId)
    }
  }
}
//(fileName)
module.exports = async (options) => {
  let data = {};
  if (options.file) {
    data = await readFile(options.file);
    if (type(data) === 'Object' && data.elements !== undefined) {
      await createElement(options, data.elements);
    }
    if (type(data) === 'Array') {
      await createElement(options, data)
    }
  }
  if (options.dir) {
    data = await buildElementsFromDir(options.dir);
    createElement(options, data);
  }
};
