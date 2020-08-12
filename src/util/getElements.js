'use strict';

const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../constants/artifact');
const {forEach, join, map, isNil, isEmpty, flatten, pipe, filter, type} = require('ramda');
const get = require('./get')
const applyQuotes = require('./quoteString');

const getExtendedElements = (qs) => get('elements', qs);
const getPrivateElements = (qs) => get('elements', qs);
const makePath = element => `elements/${element.id}/export`;
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const downloadElements = async (elements, qs, jobId, processId) => {
    let downloadPromise = await elements.map(async element => {
        try {
            if (isJobCancelled(jobId)) {
                removeCancelledJobId(jobId);
                throw new Error('job is cancelled');
            }
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.INPROGRESS, ''));
            const exportedElement = await get(makePath(element), qs);
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.COMPLETED, ''));
            return exportedElement;
        } catch (error) {
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.FAILED, error.toString()));
            throw error;
        }
    });
    let elementsExport = await Promise.all(downloadPromise);
    return elementsExport;
};

module.exports = async (keys, jobId, processId) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  const privateElementsKey = !isNilOrEmpty(keys)
    ? Array.isArray(keys)
      ? pipe(
        filter((element) => element.private),
        map((element) => element.key),
        flatten,
        join(', '),
        )(keys)
      : type(keys) === 'String'
      ? keys
      : []
    : [];
  const extendedElementsKey = !isNilOrEmpty(keys)
    ? Array.isArray(keys)
      ? pipe(
          filter((element) => !element.private),
          map((element) => element.key),
          flatten,
          join(', '),
        )(keys)
      : type(keys) === 'String'
      ? keys
      : []
    : [];

  const extended_qs = isNilOrEmpty(extendedElementsKey)
    ? {where: "extended='true'"}
    : {where: "extended='true' AND key in (" + applyQuotes(extendedElementsKey) + ')'};
  const private_qs = isNilOrEmpty(privateElementsKey)
    ? {where: "private='true'"}
    : {where: "private='true' AND key in (" + applyQuotes(privateElementsKey) + ')'};

    const privateElements = await getPrivateElements(private_qs);
    const allExtendedElements = await getExtendedElements(extended_qs);

    const privateElementIds = map((e) => e.id, privateElements);
    const extendedElements = allExtendedElements.filter((element) => !privateElementIds.includes(element.id));

    // get private elements
    const privateElementsExport = await downloadElements(privateElements, {}, jobId, processId);
    // For private elements, private flag won't get populated if we cloned any system element
    forEach((element) => (element.private = true), privateElementsExport);  
    // get extended elements
    const qs = { extendedOnly: true };
    const extendedElementsExport = await downloadElements(extendedElements, qs, jobId, processId);

    return privateElementsExport.concat(extendedElementsExport);
};