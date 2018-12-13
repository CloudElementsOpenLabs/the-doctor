const {existsSync, mkdirSync} = require('fs');
const saveElementsToDir = require('./saveElementsToDir')
const saveCommonResourcesToDir = require('./saveCommonResourcesToDir')
const saveFormulasToDir = require('./saveFormulasToDir')

module.exports = async (dir, dataPromise) => {
    const data = await dataPromise
    const elementsFolder = `${dir}/elements`
    if (!existsSync(elementsFolder)) {
        mkdirSync(elementsFolder)
    }
    await saveElementsToDir(elementsFolder, data.elements)

    const commonResourcesFolder = `${dir}/commonResources`
    if (!existsSync(commonResourcesFolder)) {
        mkdirSync(commonResourcesFolder)
    }
    await saveCommonResourcesToDir(commonResourcesFolder, {
        objectDefinitions: data.objectDefinitions,
        transformations: data.transformations
    })
    
    const formulasFolder = `${dir}/formulas`
    if (!existsSync(formulasFolder)) {
        mkdirSync(formulasFolder)
    }
    await saveFormulasToDir(formulasFolder, data.formulas)
}