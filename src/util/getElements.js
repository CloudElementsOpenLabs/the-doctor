'use strict';

const { forEach,type, map } = require('ramda');
const get = require('./get')
const applyQuotes = require('./quoteString');

const getExtendedElements = (qs) => get('elements', qs);
const getPrivateElements = (qs) => get('elements', qs);
const makePath = element => `elements/${element}/export`;


const downloadElements = async (elementIds, qs) => {
    let pathsArr = map(makePath, elementIds);
    let getByIdArr = pathsArr.map(path => get(path, qs));
    let elementsExport = await Promise.all(getByIdArr);
    return elementsExport;
};

module.exports = async (keys) => {
    let extended_qs = {where: "extended='true'"};
    let private_qs = { where: "private='true'" }
    if (type(keys) === 'String') {
        var key = applyQuotes(keys);
        private_qs = {where: "private='true' AND key in (" + key + ")"};
        extended_qs = {where: "extended='true' AND key in (" + key + ")"};
    }
    const privateElements = await getPrivateElements(private_qs);
    const extendedElements = await getExtendedElements(extended_qs);

    const privateElementIds = map(e => e.id, privateElements);
    let extendedElementsIds = map(e => e.id, extendedElements);
    extendedElementsIds = extendedElementsIds.filter(id => !privateElementIds.includes(id));

    // get private elements
    const privateElementsExport = await downloadElements(privateElementIds);

    // get extended elements
    const qs = { extendedOnly: true };
    const extendedElementsExport = await downloadElements(extendedElementsIds, qs);
    forEach(element => element.private = true, extendedElementsExport);

    let elements = privateElementsExport.concat(extendedElementsExport);

    return elements
};
