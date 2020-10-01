const {existsSync, mkdirSync} = require('fs');
const saveElementsToDir = require('./saveElementsToDir')
const {saveVdrsToDirOld} = require('../core/vdrs/download/saveVdrsToDir')
const saveFormulasToDir = require('./saveFormulasToDir')

module.exports = async (dir, dataPromise) => {
    const data = await dataPromise
    const elementsFolder = `${dir}/elements`
    if (!existsSync(elementsFolder)) {
        mkdirSync(elementsFolder)
    }
    await saveElementsToDir(elementsFolder, data.elements)

    const commonResourcesFolder = `${dir}/vdrs`
    if (!existsSync(commonResourcesFolder)) {
        mkdirSync(commonResourcesFolder)
    }
    await saveVdrsToDirOld(commonResourcesFolder, data.vdrs);
    
    const formulasFolder = `${dir}/formulas`
    if (!existsSync(formulasFolder)) {
        mkdirSync(formulasFolder)
    }
    await saveFormulasToDir(formulasFolder, data.formulas)
}