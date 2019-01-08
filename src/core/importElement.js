'use strict';

const { find, toLower } = require('ramda');
const readFile = require('../util/readFile');
const buildElementsFromDir = require('../util/buildElementsFromDir');
const createElements = require('../util/createElements');

//(fileName)
module.exports = async options => {
    const elements = options.file ? await readFile(options.file) : await buildElementsFromDir(options.dir)
    const element = find(f => toLower(f.name) === toLower(options.name))(elements)
    if(!element) {
        console.log(`The doctor was unable to find the element ${options.name}.`)
        return
    }
    await createElements([element])
}