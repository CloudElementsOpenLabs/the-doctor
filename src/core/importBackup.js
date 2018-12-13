'use strict';
const {pipe, pipeP, cond, prop, isNil, not, useWith, assoc, curry} = require('ramda');
const importElements = require('./importElements')
const importCommonResources = require('./importCommonResources')
const importFormulas = require('./importFormulas')
const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');
const createFormulas = require('../util/createFormulas');
const createElements = require('../util/createElements');
const readFile = require('../util/readFile');

const importBackupFromFile = async fileData => {
    await createElements(fileData.elements)
    createObjectDefinitions(fileData).then(r => {
        createTransformations(fileData)
    });
    await createFormulas(fileData.formulas)
}

//(fileName)
module.exports = async parms => {
    if(pipe(prop('file'), isNil, not)(parms)){
        pipeP(useWith(readFile, [prop('file', parms)]), importBackupFromFile)
    }
    if(pipe(prop('dir'), isNil, not)(parms)){
        await importElements({...parms, dir: `${parms.dir}/elements`})
        await importCommonResources({...parms, dir: `${parms.dir}/commonResources`})
        await importFormulas({...parms, dir: `${parms.dir}/formulas`})
    }
}
