const {existsSync, mkdirSync, writeFileSync} = require('fs');
const {forEachObjIndexed, dissoc, omit} = require('ramda');
const sortobject = require('deep-sort-object');
const {toDirectoryName} = require('./regex');

module.exports = async (dir, data) => {
    const resources = await data
    if (!existsSync(dir)) {
        mkdirSync(dir)
    }
    const objDefDir = `${dir}/objectDefinitions`
    if(!existsSync(objDefDir)){
        mkdirSync(objDefDir)
    }
    const transfDir = `${dir}/transformations`
    if(!existsSync(transfDir)){
        mkdirSync(transfDir)
    }

    forEachObjIndexed((object,key) => {
        const objectDirName = `${objDefDir}/${toDirectoryName(key)}`
        if (!existsSync(objectDirName)) {
            mkdirSync(objectDirName)
        }
        writeFileSync(objectDirName + '/objectDefinition.json', JSON.stringify(sortobject(dissoc('id', object)), null, 4), 'utf8')
    })(resources.objectDefinitions)

    forEachObjIndexed((element,key) => {
        const elementDirName = `${transfDir}/${toDirectoryName(key)}`
        if (!existsSync(elementDirName)) {
            mkdirSync(elementDirName)
        }
        forEachObjIndexed((transformation,key) => {
            const tranfDirName = `${elementDirName}/${toDirectoryName(key)}`
            if (!existsSync(tranfDirName)) {
                mkdirSync(tranfDirName)
            }
            let transf = omit(['id', 'elementId', 'startDate'], transformation)
            if(transf.script) {
                writeFileSync(`${tranfDirName}/script.js`, transf.script.body, 'utf8')
                transf.script = dissoc('body', transf.script)
            }
            writeFileSync(`${tranfDirName}/transformation.json`, JSON.stringify(sortobject(transf), null, 4), 'utf8')
        })(element)
    })(resources.transformations)
}