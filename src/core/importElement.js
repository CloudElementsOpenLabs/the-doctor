'use strict';

const { find, toLower, type } = require('ramda');
const readFile = require('../util/readFile');
const buildElementsFromDir = require('../util/buildElementsFromDir');
const createElements = require('../util/createElements');

const createElement = async (options, elements) => {
    const element = find(f => toLower(f.name) === toLower(options.name))(elements)
    if(!element) {
        console.log(`The doctor was unable to find the element ${options.name}.`)
        return
    }
    await createElements([element])
}
//(fileName)
module.exports = async options => {
    let data = {}
    if(options.file) {
        data = await readFile(options.file)
        if(type(data) === 'Object' && data.elements !== undefined) {
            await createElement(options, data.elements)
        }
        if(type(data) === 'Array') {
            await createElement(options, data)
        }
    }

    if(options.dir) {
        data = await buildElementsFromDir(options.dir)
        createElement(options, data)
    }
}