'use strict'

const { curry } = require('ramda')
var util = require('util')

module.exports = curry((params, data) => {
    if (!data.hasOwnProperty('options.rawArgs')) {
        return params;
    }
    if (data.options._name === "doctor-download"){
        // if -v present -n required for download, if -n present, -v optional
        if (data.options.rawArgs.includes('-n')){
            if (data.options.rawArgs.includes('-v')){
                let versionIndex = data.options.rawArgs.indexOf('-v') + 1;
                let version = data.options.rawArgs[versionIndex]
                // handle versioning for vdrs
                if (data.object === 'vdrs'){
                    let objectNameIndex = data.options.rawArgs.indexOf('-n') + 1;
                    let objectName = data.options.name;
                    let objectNameForVersion = params.objectDefinitions[objectName].objectName
                    if (objectNameForVersion.includes('_')){
                        let objectNameNoVersion = objectNameForVersion.split('_')[0]
                        params.objectDefinitions[objectName].objectName = objectNameNoVersion
                        let transformationObject = params.transformations
                        let transformationKeys = Object.keys(transformationObject);
                        let newTransformedObject = {}
                        transformationKeys.map(key => {
                            let transformationIndividualObject = transformationObject[key];
                            let objectName = Object.keys(transformationIndividualObject)[0]
                            transformationIndividualObject[objectName].objectName = objectNameNoVersion
                            let newDataObject = {[key]: {[objectNameNoVersion]: transformationIndividualObject[objectName]}}
                            Object.assign(newTransformedObject, newDataObject)
                            return;                             
                        })
                        params.transformations = newTransformedObject
                        //same for the objectDefs
                        let definitionsObject = {}
                        let index = Object.keys(params.objectDefinitions)[0]
                        Object.assign(definitionsObject, params.objectDefinitions[index])
                        delete params.objectDefinitions[index]
                        params.objectDefinitions[objectNameNoVersion] = definitionsObject;
                    }
                    else {
                        params.objectDefinitions[objectName].objectName = objectNameForVersion
                    }
                }
                //versioning for formulas
                else if (data.object === 'formulas'){
                    let formulaNameIndex = data.options.rawArgs.indexOf('-n') + 1;
                    let formulaName = data.options.rawArgs[formulaNameIndex];
                    if (formulaName.includes('_')){
                        let formulaNameNoVersion = formulaName.split('_')[0]
                        params[0].name = formulaNameNoVersion
                        return params

                    }
                    
                    else {
                        params[0].name = formulaName
                        return params

                    }
                }
            }
            else {
                return params
            }
        }
        else {
            if (!data.options.rawArgs.includes('-d')){
                console.log('operation failed: -n flag required to use -v on `doctor download`')
                process.exit(1)
            }
            else{
                return params
            }
        }
    }
    else {
        // -n not required for uploads, check that -v is present or do nothing
        if (data.rawArgs.includes('-v')){
            let versionIndex = data.rawArgs.indexOf('-v') + 1;
            let version = data.rawArgs[versionIndex]
            //handle versioning for vdrs
            if (data.args[0] === 'vdrs'){
                let objectNameForVersion = Object.keys(params.objectDefinitions)[0]
                if (objectNameForVersion.includes('_')){
                    let objectNameNoVersion = objectNameForVersion.split('_')[0]
                    let versionedObjectName = objectNameNoVersion + '_' + version
                    let versionedDefinitionObject = objectDefinitions.objectNameForVersion
                    params.objectDefinitions[objectNameForVersion].objectName = versionedObjectName
                    params.objectDefinitions.objectNameForVersion = versionedDefinitionObject 
                }
                else {
                    //version the objectDefinitions
                    params.objectDefinitions[objectNameForVersion].objectName = objectNameForVersion + '_' + version
                    let versionedDefinitionObject = params.objectDefinitions[objectNameForVersion]
                    let versionedObjectName = objectNameForVersion + '_' + version
                    params.objectDefinitions[objectNameForVersion].objectName = versionedObjectName
                    params.objectDefinitions[versionedObjectName] = versionedDefinitionObject
                    delete params.objectDefinitions[objectNameForVersion]
                    //version the transformations object
                    let transformationObject = params.transformations
                    let transformationKeys = Object.keys(transformationObject);
                    let newTransformedObject = {}
                    transformationKeys.map(key => {
                        let transformationIndividualObject = transformationObject[key];
                        let objectName = Object.keys(transformationIndividualObject)[0]
                        transformationIndividualObject[objectName].objectName = versionedObjectName
                        let newDataObject = {[key]: {[versionedObjectName]: transformationIndividualObject[objectName]}}
                        Object.assign(newTransformedObject, newDataObject)
                        return;                             
                    })
                    params.transformations = newTransformedObject
                }
            }
            //versioning for formulas
            else if (data.args[0] === 'formulas'){
                let formulaName = params[0].name
                if (formulaName.includes('_')){
                    let formulaNameNoVersion = formulaName.split('_')[0]
                    params[0].name = formulaNameNoVersion + '_' + version
                    delete params[0].id
                }
                else {
                    params[0].name = formulaName + '_' + version
                    delete params[0].id
                }
            }
        }
    }
    return params
})
