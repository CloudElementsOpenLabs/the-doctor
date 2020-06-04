'use strict';
const { readFileSync, lstatSync, readdir, existsSync } = require('fs');
const readFile = require('../../../util/readFile');
const { join } = require('path');
const { promisify } = require('util');
const isDirectory = source => lstatSync(source).isDirectory()


module.exports = async (dirName, vdrname) => {
    let vdrs = {};
    const vdrNames = vdrname ? [vdrname] : await promisify(readdir)(dirName);
    for (const vdrName of vdrNames) {
        if (vdrName.startsWith('backup-')) {
            continue;
        }

        const vdrFolder = join(dirName, vdrName);
        const vdrFile = join(vdrFolder, `${vdrName}.json`);
        let vdr = {};
        if (isDirectory(vdrFolder) && existsSync(vdrFile)) {
            vdr = await readFile(vdrFile)
        }

        const definitionFolder = join(vdrFolder, 'definition');
        const objectDefinitionFile = join(definitionFolder, 'objectDefinition.json')
        if (isDirectory(definitionFolder) && existsSync(objectDefinitionFile)) {
            vdr.definition = await readFile(objectDefinitionFile)
        }

        const transformationFolder = join(vdrFolder, 'transformation');
        const elementKeys = await promisify(readdir)(transformationFolder)
        for (const elementKey of elementKeys) {
            const elementTransformationDir = join(transformationFolder, elementKey);
            const elementTransformationFile = join(elementTransformationDir, 'transformation.json');
            let elementTransformation = {};
            if (isDirectory(elementTransformationDir) && existsSync(elementTransformationFile)) {
                elementTransformation = await readFile(elementTransformationFile)
            }

            if (elementTransformation.script) {
                const elementTransformationScriptFile = join(elementTransformationDir, 'script.js');
                elementTransformation.script = {
                    ...elementTransformation.script,
                    body: readFileSync(elementTransformationScriptFile).toString()
                }
            }
            vdr.transformation[elementKey] = elementTransformation;
        }
        vdrs[vdrName] = vdr;
    }
    return vdrs;
}