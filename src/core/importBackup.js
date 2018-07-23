'use strict';

const createObjectDefinitions = require('../util/createObjectDefinitions');
const createTransformations = require('../util/createTransformations');
const createFormulas = require('../util/createFormulas');
const createElements = require('../util/createElements');
const readFile = require('../util/readFile');
const {pipeP, tap, prop} = require('ramda');

module.exports = async (fileName) => {
    const fileData = await readFile(fileName);
    createObjectDefinitions(fileData).then(r => {
        createTransformations(fileData)
    });
    await createFormulas(fileData.formulas);
    await createElements(fileData.elements);
}