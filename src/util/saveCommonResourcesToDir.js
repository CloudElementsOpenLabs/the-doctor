const {existsSync, mkdirSync, writeFileSync} = require('fs');
const {forEachObjIndexed, dissoc, omit, forEach, type, equals, assoc} = require('ramda');
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

    const objectDefinitions = resources.objectDefinitions;
    if (equals(type(objectDefinitions), 'Array')) {
        forEach(objectDefinition => {
            const vdrLevel = objectDefinition.level || '';
            const objectDirName = `${objDefDir}/${toDirectoryName(vdrLevel)}`
            if (!existsSync(objectDirName)) {
                mkdirSync(objectDirName)
            }
            objectDefinition.fields = objectDefinition.fields.sort((a, b) => a.path.localeCompare(b.path))
            writeFileSync(objectDirName + '/objectDefinition.json', JSON.stringify(sortobject(dissoc('id', objectDefinition)), null, 4), 'utf8')

        }, objectDefinitions);
    } else {
            const vdrLevel = objectDefinitions.level || '';
            const objectDirName = `${objDefDir}/${toDirectoryName(vdrLevel)}`
            if (!existsSync(objectDirName)) {
                mkdirSync(objectDirName)
            }
            if (objectDefinitions && objectDefinitions.fields) {
                objectDefinitions.fields = objectDefinitions.fields.sort((a, b) => a.path.localeCompare(b.path));
            }
            writeFileSync(objectDirName + '/objectDefinition.json', JSON.stringify((dissoc('id', objectDefinitions)), null, 4), 'utf8')
    }

    const transformations = resources.transformations;
    if (equals(type(transformations), 'Array')) {
        forEach(objectTranformation => {
            forEachObjIndexed((element, key) => {
                const vdrLevel = element.level || '';
                const vdrLevelDirName = `${transfDir}/${toDirectoryName(vdrLevel)}`
                if (!existsSync(vdrLevelDirName)) {
                    mkdirSync(vdrLevelDirName)
                }
                let transf = omit(['id', 'elementId', 'startDate'], element)
                if(transf.script) {
                    writeFileSync(`${vdrLevelDirName}/script.js`, transf.script.body, 'utf8')
                    transf.script = dissoc('body', transf.script)
                }
                writeFileSync(`${vdrLevelDirName}/transformation.json`, JSON.stringify(assoc(key, transf, {}), null, 4), 'utf8')
            })(objectTranformation);
        }, transformations);
    } else {
        forEachObjIndexed((transformation, key) => {
        const elementDirName = `${transfDir}/${toDirectoryName(key)}`
        if (!existsSync(elementDirName)) {
            mkdirSync(elementDirName)
        }
        const vdrLevel = objectDefinitions.level || '';
        const tranfDirName = `${elementDirName}/${toDirectoryName(vdrLevel)}`
        if (!existsSync(tranfDirName)) {
            mkdirSync(tranfDirName)
        }
        let transf = omit(['id', 'elementId', 'startDate'], transformation)
        if(transf.script) {
            writeFileSync(`${tranfDirName}/script.js`, transf.script.body, 'utf8')
            transf.script = dissoc('body', transf.script)
        }
        writeFileSync(`${tranfDirName}/transformation.json`, JSON.stringify(assoc(key, transf, {}), null, 4), 'utf8')
    })(transformations)
}
}