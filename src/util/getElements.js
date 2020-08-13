'use strict';

const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../constants/artifact');
const { forEach, map } = require('ramda');
const get = require('./get')

const getExtendedElements = require('./getExtendedElements');
const getPrivateElements = require('./getPrivateElements');
const makePath = element => `elements/${element.id}/export`;

const downloadElements = async (elements, qs, jobId, processId, isPrivate) => {
    let downloadPromise = await elements.map(async element => {
        try {
            if (isJobCancelled(jobId)) {
                removeCancelledJobId(jobId);
                throw new Error('job is cancelled');
            }
            const elementMetadata = JSON.stringify({private: isPrivate});
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.INPROGRESS, '', elementMetadata, false));
            const exportedElement = await get(makePath(element), qs);
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.COMPLETED, '', elementMetadata, false));
            return exportedElement;
        } catch (error) {
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.FAILED, error.toString(), elementMetadata, false));
            throw error;
        }
    });
    let elementsExport = await Promise.all(downloadPromise);
    return elementsExport;
};

module.exports = async (keys, jobId, processId) => {
    const privateElements = await getPrivateElements(keys);
    const allExtendedElements = await getExtendedElements(keys);

    const extendedElements = !isNilOrEmpty(allExtendedElements)
        ? allExtendedElements.filter((element) => element.extended && !element.private) : [];

    // get private elements
    const privateElementsExport = await downloadElements(privateElements, {}, jobId, processId, true);
    // For private elements, private flag won't get populated if we cloned any system element
    forEach((element) => (element.private = true), privateElementsExport);
    // get extended elements
    const qs = { extendedOnly: true };
    const extendedElementsExport = await downloadElements(extendedElements, qs, jobId, processId, false);

    const elements = privateElementsExport.concat(extendedElementsExport);

    const newlyCreated = keys && Array.isArray(keys) ? keys.filter(key => {
        return key.private && !privateElements.some(element => element.key == key.key)
    }) : [];
    newlyCreated.forEach(element => {
        emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.COMPLETED, '', '', true));
    })

    return elements;
};
