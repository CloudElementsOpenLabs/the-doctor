const { existsSync, mkdirSync, writeFileSync, rename, readdir, lstatSync } = require('fs');
const { forEachObjIndexed, dissoc, omit } = require('ramda');
const sortobject = require('deep-sort-object');
const { join } = require('path');
const { promisify } = require('util');

const createDirIfNotExist = (dirPath) => {
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath);
    }
}

const moveOldFilestoBackup = async (dirPath) => {
    if (existsSync(dirPath)) {
        const backupDir = join(dirPath, `backup-${new Date().toLocaleString()}`);
        const fileNames = await promisify(readdir)(dirPath);

        for (const fileName of fileNames) {
            const oldPath = join(dirPath, fileName);
            if (lstatSync(oldPath).isDirectory() && (fileName === 'objectDefinitions' || fileName === 'transformations')) {
                const newPath = join(backupDir, fileName);
                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                })
            }
        }
    }
}

module.exports = async (dir, data) => {
    const vdrs = await data

    if (!existsSync(dir)) {
        mkdirSync(dir)
    }
    for (let [vdrName, vdrNameObject] of Object.entries(vdrs)) {
        const vdrDir = `${dir}/${vdrName}`;
        createDirIfNotExist(vdrDir);
        moveOldFilestoBackup(vdrDir);
        writeFileSync(`${vdrDir}/${vdrName}.json`, JSON.stringify(sortobject(vdrNameObject), null, 4), 'utf8')

        // save defintion
        const definition = vdrNameObject.definition;
        const definitionDir = `${vdrDir}/definition`;
        createDirIfNotExist(definitionDir);
        definition.fields = definition.fields.sort((a, b) => a.path.localeCompare(b.path))
        writeFileSync(definitionDir + '/objectDefinition.json', JSON.stringify(sortobject(definition), null, 4), 'utf8')


        // save transformation
        const transformations = vdrNameObject.transformation;
        const transformationDir = `${vdrDir}/transformation`;
        createDirIfNotExist(transformationDir);
        forEachObjIndexed((elementTransformtaion, elementKey) => {
            const elementTransformtaionDir = `${transformationDir}/${elementKey}`
            createDirIfNotExist(elementTransformtaionDir);
            if (elementTransformtaion.script) {
                writeFileSync(`${elementTransformtaionDir}/script.js`, elementTransformtaion.script.body, 'utf8')
                elementTransformtaion.script = dissoc('body', elementTransformtaion.script)
            }
            writeFileSync(`${elementTransformtaionDir}/transformation.json`, JSON.stringify(sortobject(elementTransformtaion), null, 4), 'utf8')
        })(transformations)
    };
}