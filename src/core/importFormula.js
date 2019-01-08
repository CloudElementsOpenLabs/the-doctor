'use strict';

const { any, find, toLower } = require('ramda');
const readFile = require('../util/readFile');
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');

const createFormula = (options, formulas) => {
    const formula = find(f => toLower(f.name) === toLower(options.name))(formulas)
    if(!formula) {
        console.log(`The doctor was unable to find the formula ${options.name}.`)
        return
    }
    if(any(s => s.type === 'formula')(formula.steps)) {
        console.log('You are trying to import a formula that has a sub formula. Please import all formulas.')
    } else {
        createFormulas([formula])
    }
}

//(fileName)
module.exports = async options => {
    const formulas = options.file ? await readFile(options.file) : await buildFormulasFromDir(options.dir)
    createFormula(options, formulas)
}