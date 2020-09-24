const {existsSync, mkdirSync, writeFileSync, renameSync, readdir, lstatSync} = require('fs');
const {forEachObjIndexed, dissoc} = require('ramda');
const sortobject = require('deep-sort-object');
const {join} = require('path');
const {promisify} = require('util');
const {replaceall} = require('replaceall');

const toDirectoryName = (name) =>
  name
    .replace(/[?>-]|(\|)|(\/)/g, ' ')
    .replace(/[|]+/g, ' ')
    .trim()
    .replace(/ +/g, '-');

const createDirIfNotExist = (dirPath) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }
};

const getBackupDirName = () => {
  let backupFolderName = `backup-${new Date().toLocaleString()}`;
  backupFolderName = replaceall('/', '-', backupFolderName);
  backupFolderName = replaceall(',', '-', backupFolderName);
  backupFolderName = replaceall(':', '-', backupFolderName);
  return replaceall(' ', '-', backupFolderName);
};

const moveOldFilestoBackup = async (dirPath) => {
  if (existsSync(dirPath)) {
    const backupFolderName = getBackupDirName();
    const backupDir = join(dirPath, backupFolderName);
    const fileNames = await promisify(readdir)(dirPath);
    for (const fileName of fileNames) {
      const oldPath = join(dirPath, fileName);
      if (
        existsSync(oldPath) &&
        lstatSync(oldPath).isDirectory() &&
        (fileName === 'objectDefinitions' || fileName === 'transformations')
      ) {
        createDirIfNotExist(backupDir);
        const newPath = join(backupDir, fileName);
        createDirIfNotExist(newPath);
        renameSync(oldPath, newPath);
      }
    }
  }
};

/**
 * Save all the exported vdrs to specified directory
 * The saved vdrs folder structure looks something like this:
 * {vdrName} |-> {vdrName}.json
 *           |-> definition      |-> objectDefinition.js
 *           |-> transformations |-> {elementKey}       |-> transformation.json
 *                                                      |-> script.js
 * @param {String} dir
 * @param {Object} data
 */
const saveVdrsToDirNew = async (dir, data) => {
  try {
    const vdrs = await data;
    createDirIfNotExist(dir);
    moveOldFilestoBackup(dir);
    forEachObjIndexed((vdrNameObject, vdrName) => {
      const vdrDir = `${dir}/${vdrName}`;
      createDirIfNotExist(vdrDir);
      writeFileSync(`${vdrDir}/${vdrName}.json`, JSON.stringify(sortobject(vdrNameObject), null, 4), 'utf8');
      // save defintion
      const definition = vdrNameObject.definition;
      const definitionDir = `${vdrDir}/definition`;
      createDirIfNotExist(definitionDir);
      definition.fields = definition.fields.sort((a, b) => a.path.localeCompare(b.path));
      writeFileSync(definitionDir + '/objectDefinition.json', JSON.stringify(sortobject(definition), null, 4), 'utf8');
      // save transformation
      const transformations = vdrNameObject.transformation;
      const transformationDir = `${vdrDir}/transformation`;
      createDirIfNotExist(transformationDir);
      forEachObjIndexed((elementTransformtaion, elementKey) => {
        const elementTransformtaionDir = `${transformationDir}/${elementKey}`;
        createDirIfNotExist(elementTransformtaionDir);
        if (elementTransformtaion && elementTransformtaion.scripts) {
          elementTransformtaion.scripts.forEach((script, index, scripts) => {
            writeFileSync(`${elementTransformtaionDir}/${script.level}-script.js`, script.body, 'utf8');
            scripts[index] = dissoc('body', script);
          });
        } else if (elementTransformtaion && elementTransformtaion.script) {
          writeFileSync(`${elementTransformtaionDir}/script.js`, elementTransformtaion.script.body, 'utf8');
          elementTransformtaion.script = dissoc('body', elementTransformtaion.script);
        }
        writeFileSync(
          `${elementTransformtaionDir}/transformation.json`,
          JSON.stringify(sortobject(elementTransformtaion), null, 4),
          'utf8',
        );
      })(transformations);
    }, vdrs);
  } catch (error) {
    throw error;
  }
};

/**
 * Save all the exported vdrs to specified directory
 * The saved vdrs folder structure looks something like this:
 * {vdrName} |-> objectDefinitions |-> {vdrName}    |-> objectDefinition.js
 *           |-> transformations  |-> {elementKey} |-> {vdrName} |-> transformation.json
 *                                                               |-> script.js
 * @param {String} dir
 * @param {Object} data
 */
const saveVdrsToDirOld = async (dir, data) => {
  try {
    const vdrs = await data;
    createDirIfNotExist(dir);
    const definitionDir = `${dir}/objectDefinitions`;
    createDirIfNotExist(definitionDir);
    const transformationDir = `${dir}/transformations`;
    createDirIfNotExist(transformationDir);

    forEachObjIndexed((vdr, vdrName) => {
      // save definition
      const objectDirName = `${definitionDir}/${toDirectoryName(vdrName)}`;
      createDirIfNotExist(objectDirName);
      vdr.definition.fields = vdr.definition.fields.sort((a, b) => a.path.localeCompare(b.path));
      writeFileSync(
        objectDirName + '/objectDefinition.json',
        JSON.stringify(sortobject(dissoc('id', vdr.definition)), null, 4),
        'utf8',
      );
      // save transformation
      forEachObjIndexed((elementTransformation, elementKey) => {
        const elementTransformtaionDir = `${transformationDir}/${elementKey}`;
        createDirIfNotExist(elementTransformtaionDir);
        const elementTransformtaionByVdrNameDir = `${elementTransformtaionDir}/${vdrName}`;
        createDirIfNotExist(elementTransformtaionByVdrNameDir);
        if (elementTransformation && elementTransformation.script) {
          writeFileSync(`${elementTransformtaionByVdrNameDir}/script.js`, elementTransformation.script.body, 'utf8');
          elementTransformation.script = dissoc('body', elementTransformation.script);
        }
        writeFileSync(
          `${elementTransformtaionByVdrNameDir}/transformation.json`,
          JSON.stringify(sortobject(elementTransformation), null, 4),
          'utf8',
        );
      })(vdr.transformation);
    })(vdrs);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveVdrsToDirNew,
  saveVdrsToDirOld,
};
