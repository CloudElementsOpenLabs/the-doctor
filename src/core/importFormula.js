'use strict';

const { any, find, toLower, identity } = require('ramda');
const readFile = require('../util/readFile');
const buildFormulasFromDir = require('../util/buildFormulasFromDir');
const createFormulas = require('../util/createFormulas');

const createFormula = async (options, formulas) => {
    var names = options.name.split(',')
    var assets = [];
    names.forEach(fname => {
        const formula = find(f => toLower(f.name) === toLower(fname))(formulas)
        if (!formula) {
            console.log(`The doctor was unable to find the formula ${fname}.`)
        } else if (any(s => s.type === 'formula')(formula.steps)) {
            console.log('You are trying to import a formula that has a sub formula. Please import all formulas.')
        } else {
            assets.push(formula)
        }
    })
    if (assets.length > 0) {
        await createFormulas(assets, options.jobId, options.processId)
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
        await createFormula(options, data)
    }
}
