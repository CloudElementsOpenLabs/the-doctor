'use strict';

const { any, find, toLower, identity } = require('ramda');
const readFile = require('../util/readFile');
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');

const createFormula = async (options, formulas) => {
    const formula = find(f => toLower(f.name) === toLower(options.name))(formulas)
    if(!formula) {
        console.log(`The doctor was unable to find the formula ${options.name}.`)
        return
    }
    if(any(s => s.type === 'formula')(formula.steps)) {
        console.log('You are trying to import a formula that has a sub formula. Please import all formulas.')
    } else {
        await createFormulas([formula])
    }
}

//(fileName)
module.exports = async options => {
    let data = {}
    if(options.file) {
        data = await readFile(options.file)
        if(type(data) === 'Object' && data.formulas !== undefined) {
            await createFormula(options, data.formulas)
        }
        if(type(data) === 'Array') {
            await createFormula(options, data)
        }
    }

    if(options.dir) {
        data = await buildFormulasFromDir(options.dir)
        createFormula(options, data)
    }
}