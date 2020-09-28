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
  __,
  isEmpty,
  toLower,
  find,
  any,
  curry,
} = require('ramda');
const readFile = require('../util/readFile');
const applyVersion = require('../util/applyVersion');
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const importFormulas = curry(async (formulas, options) => {
  try {
    // From CLI - User can pass comma seperated string of formula name
    // From Service - It will be in Array of objects containing formula name
    let formulasToImport = [];
    if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
      let formulaNames = Array.isArray(options.name)
        ? options.name.map((formulaName) => formulaName.name)
        : options.name.split(',');
      formulaNames &&
        formulaNames.forEach((formulaName) => {
          const formulaToImport = find((formula) => toLower(formula.name) === toLower(formulaName))(formulas);
          if (isNilOrEmpty(formulaToImport)) {
            console.log(`The doctor was unable to find the formula ${formulaName}.`);
          } else if (any((step) => step.type === 'formula')(formulaToImport.steps)) {
            console.log(`You are trying to import a formula (${formulaName}) that has a sub formula. Please make sure to import all formulas.`);
            formulasToImport.push(formulaToImport);
          } else {
            formulasToImport.push(formulaToImport);
          }
        });
    }
    formulasToImport = isNilOrEmpty(formulasToImport) ? formulas : formulasToImport;
    await createFormulas(formulasToImport, options.jobId, options.processId);
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
          pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options)),
          cond([
            [
              pipe(type, equals('Object')) && pipe(prop('formulas'), isNil, not),
              pipe(prop('formulas'), importFormulas(__, options)),
            ],
            [pipe(type, equals('Array')), importFormulas(__, options)],
          ]),
        ),
      ],
      [
        pipe(prop('dir'), isNil, not),
        pipeP(useWith(buildFormulasFromDir, [prop('dir')]), applyVersion(__, options), importFormulas(__, options)),
      ],
    ])(options);
  } catch (error) {
    console.log('Failed to complete formula operation: ', error.message);
    throw error;
  }
};
