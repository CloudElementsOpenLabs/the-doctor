'use strict';

const { find, toLower, type } = require('ramda');
const readFile = require('../util/readFile');
const buildElementsFromDir = require('../util/buildElementsFromDir');
const createElements = require('../util/createElements');

const createElement = async (options, elements) => {
    var names = options.name.split(',')
    var assets = [];
    names.forEach(ename => {
        const element = find(f => toLower(f.name) === toLower(ename))(elements)
        if (!element) {
            console.log(`The doctor was unable to find the element ${ename}.`)
        } else {
            assets.push(element)
        }
    })
    if (assets.length > 0) {
        await createElements(assets)
    }
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
