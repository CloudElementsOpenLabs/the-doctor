'use strict';

const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled } = require('../events/cancelled-job');
const { forEach,type, map } = require('ramda');
const get = require('./get')
const applyQuotes = require('./quoteString');

const getExtendedElements = (qs) => get('elements', qs);
const getPrivateElements = (qs) => get('elements', qs);
const makePath = element => `elements/${element.id}/export`;


const downloadElements = async (elements, qs, jobId, processId) => {
    let downloadPromise = await elements.map(async element => {
        try {
            if (isJobCancelled(jobId)) {
                throw new Error('job is cancelled');
            }
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'elements', element.key, 'inprogress', ''));
            const exportedElement = await get(makePath(element), qs);
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'elements', element.key, 'completed', ''));
            return exportedElement;
        } catch (error) {
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'elements', element.key, 'error', error.toString()));
            throw error;
        }
    });
    let elementsExport = await Promise.all(downloadPromise);
    return elementsExport;
};

module.exports = async (keys, jobId, processId) => {
    let extended_qs = { where: "extended='true'" };
    let private_qs = { where: "private='true'" }
    if (type(keys) === 'String') {
        var key = applyQuotes(keys);
        private_qs = { where: "private='true' AND key in (" + key + ")" };
        extended_qs = { where: "extended='true' AND key in (" + key + ")" };
    }
    const privateElements = await getPrivateElements(private_qs);
    const allExtendedElements = await getExtendedElements(extended_qs);

    const privateElementIds = map(e => e.id, privateElements);
    const extendedElements = allExtendedElements.filter(element => !privateElementIds.includes(element.id));

    // get private elements
    const privateElementsExport = await downloadElements(privateElements, {}, jobId, processId);

    // get extended elements
    const qs = { extendedOnly: true };
    const extendedElementsExport = await downloadElements(extendedElements, qs, jobId, processId);
    forEach(element => element.private = true, extendedElementsExport);

    let elements = privateElementsExport.concat(extendedElementsExport);

    return elements
};
