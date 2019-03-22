'use strict';
const { readFileSync, lstatSync, readdir, existsSync } = require('fs');
const readFile = require('./readFile');
const { join } = require('path');
const {promisify} = require('util');
const isDirectory = source => lstatSync(source).isDirectory()

const getObjectDefinitions = async (source) =>{
    let result = {}
    const objects = await promisify(readdir)(source)
    for(const object of objects){
        const objectFolder = join(source, object)
        const objectFile = join(objectFolder, 'objectDefinition.json')
        if(isDirectory(objectFolder) && existsSync(objectFile)) {
            result[object] = await readFile(objectFile)
        }
    }
    return result
}

const buildTransformations = async (source) => {
    let result = {}
    const elements = await promisify(readdir)(source)
    for(const element of elements) {
        const elementFolder = join(source, element)
        if(isDirectory(elementFolder)) {
            const transformations = await promisify(readdir)(elementFolder)
            for(const name of transformations) {
                const transformationFolder = join(elementFolder, name)
                const transformationFile = join(transformationFolder, 'transformation.json')
                if(isDirectory(transformationFolder) && existsSync(transformationFile)){
                    result[element] = result[element] ? result[element] : {}
                    const transformation = await readFile(transformationFile)
                    if(transformation.script) {
                        const scriptPath = transformationFile.replace('transformation.json','script.js')
                        transformation.script = {
                            ...transformation.script, 
                            body: readFileSync(scriptPath).toString()
                        }
                    }
                    result[element][name] = transformation
                }
            }
        }
    }
    return result
}

module.exports = async (dirName) => ({
        objectDefinitions: await getObjectDefinitions(`${dirName}/objectDefinitions`),
        transformations: await buildTransformations(`${dirName}/transformations`)
    })