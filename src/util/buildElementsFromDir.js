'use strict';
const { readFileSync, lstatSync, readdir, existsSync } = require('fs');
const readFile = require('./readFile');
const getResourceName = require('./getResourceName')
const { join } = require('path');
const {promisify} = require('util');
const {toDirectoryName} = require('./regex');
const {pipe, map, filter} = require('ramda');
const isDirectory = source => lstatSync(source).isDirectory()

const getDirectories = async source =>{
    const items = await promisify(readdir)(source)
    return pipe(
        map(name => join(source, name)),
        filter(isDirectory),
        map(name => join(name, 'element.json')),
        filter(existsSync),
    )(items)
}

const buildHooks = elementFolder => map(h => 
    ({
        ...h, 
        body: readFileSync(`${elementFolder}/${h.type}Hook.js`).toString()
    }))

const toElementFolderName = (dirName, elementName) => `${dirName}/${toDirectoryName(elementName)}`

const buildResources = elementFolder => map(r => 
    r.hooks ? {
        ...r,
        hooks: map(h => ({
            ...h,
            body: readFileSync(`${elementFolder}/resources/${getResourceName(r)}${h.type}Hook.js`).toString()
        }))(r.hooks)
    }: r )

module.exports = async (dirName) => {
    const directories = await getDirectories(dirName)
    const elements = await Promise.all(map(readFile)(directories))
    return map(e => ({
        ...e, 
        hooks: e.hooks? pipe(toElementFolderName, buildHooks)(dirName, e.name)(e.hooks): [],
        resources: e.resources? pipe(toElementFolderName, buildResources)(dirName, e.name)(e.resources) : []
    }))(elements)
}
