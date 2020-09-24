'use strict';
const {readFileSync, lstatSync, readdir, existsSync} = require('fs');
const readFile = require('../../../util/readFile');
const {join} = require('path');
const {promisify} = require('util');
const isDirectory = (source) => lstatSync(source).isDirectory();

const buildVdrV2FromDir = async (dirName, vdrname) => {
  let vdrs = {};
  const vdrNames = vdrname ? [vdrname] : await promisify(readdir)(dirName);
  for (const vdrName of vdrNames) {
    if (vdrName.startsWith('backup-') || vdrName.startsWith('.DS_Store')) {
      continue;
    }

    const vdrFolder = join(dirName, vdrName);
    const vdrFile = join(vdrFolder, `${vdrName}.json`);
    let vdr = {};
    if (isDirectory(vdrFolder) && existsSync(vdrFile)) {
      vdr = await readFile(vdrFile);
    }

    const definitionFolder = join(vdrFolder, 'definition');
    const objectDefinitionFile = join(definitionFolder, 'objectDefinition.json');
    if (isDirectory(definitionFolder) && existsSync(objectDefinitionFile)) {
      vdr.definition = await readFile(objectDefinitionFile);
    }

    const transformationFolder = join(vdrFolder, 'transformation');
    const elementKeys = await promisify(readdir)(transformationFolder);
    for (const elementKey of elementKeys) {
      const elementTransformationDir = join(transformationFolder, elementKey);
      const elementTransformationFile = join(elementTransformationDir, 'transformation.json');
      let elementTransformation = {};
      if (isDirectory(elementTransformationDir) && existsSync(elementTransformationFile)) {
        elementTransformation = await readFile(elementTransformationFile);
      }
      if (elementTransformation && elementTransformation.scripts) {
        elementTransformation.scripts.forEach((script, index, scripts) => {
          const elementTransformationScriptFile = join(elementTransformationDir, `${script.level}-script.js`);
          scripts[index] = {
            ...script,
            body: readFileSync(elementTransformationScriptFile).toString(),
          };
        });
      } else if (elementTransformation && elementTransformation.script) {
        const elementTransformationScriptFile = join(elementTransformationDir, 'script.js');
        elementTransformation.script = {
          ...elementTransformation.script,
          body: readFileSync(elementTransformationScriptFile).toString(),
        };
      }
      vdr.transformation[elementKey] = elementTransformation;
    }
    vdrs[vdrName] = vdr;
  }
  return vdrs;
};

const getObjectDefinitions = async (source) => {
  let result = {};
  const objects = await promisify(readdir)(source);
  for (const object of objects) {
    const objectFolder = join(source, object);
    const objectFile = join(objectFolder, 'objectDefinition.json');
    if (isDirectory(objectFolder) && existsSync(objectFile)) {
      result[object] = await readFile(objectFile);
    }
  }
  return result;
};

const buildTransformations = async (source) => {
  let result = {};
  const elements = await promisify(readdir)(source);
  for (const element of elements) {
    const elementFolder = join(source, element);
    if (isDirectory(elementFolder)) {
      const transformations = await promisify(readdir)(elementFolder);
      for (const name of transformations) {
        const transformationFolder = join(elementFolder, name);
        const transformationFile = join(transformationFolder, 'transformation.json');
        if (isDirectory(transformationFolder) && existsSync(transformationFile)) {
          result[element] = result[element] ? result[element] : {};
          const transformation = await readFile(transformationFile);
          if (transformation && transformation.script) {
            const scriptPath = transformationFile.replace('transformation.json', 'script.js');
            transformation.script = {
              ...transformation.script,
              body: readFileSync(scriptPath).toString(),
            };
          }
          result[element][name] = transformation;
        }
      }
    }
  }
  return result;
};

const buildVdrV1FromDir = async (dirName) => ({
  objectDefinitions: await getObjectDefinitions(`${dirName}/objectDefinitions`),
  transformations: await buildTransformations(`${dirName}/transformations`),
});

module.exports = async (dirName, vdrNames) => {
  if (
    existsSync(`${dirName}/objectDefinitions`) &&
    existsSync(`${dirName}/transformations`)
  ) {
    return await buildVdrV1FromDir(dirName);
  } else {
    return await buildVdrV2FromDir(dirName, vdrNames);
  }
};
