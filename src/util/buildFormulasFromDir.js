'use strict';
const { readFileSync, lstatSync, readdir, existsSync } = require('fs');
const readFile = require('./readFile');
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
        map(name => join(name, 'formula.json')),
        filter(existsSync),
    )(items)
}

const buildJSSteps = (formulaName, dirName, steps) => map(s => 
    s.type === 'script' || s.type === 'filter'? 
    {
        ...s, 
        properties: { body: readFileSync(`${dirName}/${toDirectoryName(formulaName)}/${toDirectoryName(s.name)}.js`).toString() }
    } 
    : s)(steps)

module.exports = async (dirName) => {
    const directories = await getDirectories(dirName)
    const formulas = await Promise.all(map(readFile)(directories))
    return map(f => ({...f, steps: buildJSSteps(f.name, dirName, f.steps) }))(formulas)
}
