'use strict';
const {any, find, toLower, isNil, isEmpty} = require('ramda');
const readFile = require('../util/readFile');
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const createFormula = async (options, formulas) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  let formulasToImport = [];
  if (!isNilOrEmpty(options.name)) {
    let formulaNames = Array.isArray(options.name)
      ? options.name.map((formulaName) => formulaName.name)
      : options.name.split(',');
    formulaNames &&
      formulaNames.forEach((formulaName) => {
        const formulaToImport = find((formula) => toLower(formula.name) === toLower(formulaName))(formulas);
        if (isNilOrEmpty(formulaToImport)) {
          console.log(`The doctor was unable to find the formula ${fname}.`);
        } else if (any((step) => step.type === 'formula')(formulaToImport.steps)) {
          console.log('You are trying to import a formula that has a sub formula. Please import all formulas.');
        } else {
          formulasToImport.push(formulaToImport);
        }
      });
  }
  if (!isNilOrEmpty(formulasToImport)) {
    await createFormulas(formulasToImport, options.service);
  }
};

//(fileName)
module.exports = async (options) => {
  let data = {};
  if (options.file) {
    data = await readFile(options.file);
    if (type(data) === 'Object' && data.formulas !== undefined) {
      await createFormula(options, data.formulas);
    }
    if (type(data) === 'Array') {
      await createFormula(options, data);
    }
  }

  if (options.dir) {
    data = await buildFormulasFromDir(options.dir);
    createFormula(options, data);
  }
};
