'use strict';

const { forEach, map } = require('ramda');
const get = require('./get')

const getExtendedElements = () => get('elements', { where: "extended='true'" });
const getPrivateElements = () => get('elements', { where: "private='true'" });
const makePath = element => `elements/${element}/export`;


const downloadElements = async (elementIds) => {
    let pathsArr = map(makePath, elementIds);
    let getByIdArr = pathsArr.map(path => get(path, ""));
    let elementsExport = await Promise.all(getByIdArr);
    return elementsExport;
};

module.exports = async () => {
    const privateElements = await getPrivateElements();
    const extendedElements = await getExtendedElements();

    const privateElementIds = map(e => e.id, privateElements);
    let extendedElementsIds = map(e => e.id, extendedElements);
    extendedElementsIds = extendedElementsIds.filter(id => !privateElementIds.includes(id));

    const privateElementsExport = await downloadElements(privateElementIds);
    const extendedElementsExport = await downloadElements(extendedElementsIds);

    forEach(element => element.actuallyExtended = true, extendedElementsExport);

    let elements = privateElementsExport.concat(extendedElementsExport);

    return elements
};
