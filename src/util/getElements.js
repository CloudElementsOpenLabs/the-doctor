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

const downloadElements = async (elements, qs, jobId, processId, isPrivate) => {
    let downloadPromise = await elements.map(async element => {
        try {
            if (isJobCancelled(jobId)) {
                removeCancelledJobId(jobId);
                throw new Error('job is cancelled');
            }
            const elementMetadata = JSON.stringify({private: isPrivate});
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.INPROGRESS, '', elementMetadata));
            const exportedElement = await get(makePath(element), qs);
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.COMPLETED, '', elementMetadata));
            return exportedElement;
        } catch (error) {
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.FAILED, error.toString(), elementMetadata));
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

  // For CLI, if elements keys are empty then default the qs to true
  // For Doctor-service, if any private or extended keys are empty then don't make API call
  const private_qs = isNilOrEmpty(privateElementsKey)
    ? isNilOrEmpty(jobId) ? {where: "private='true'"} : ''
    : {where: "private='true' AND key in (" + applyQuotes(privateElementsKey) + ')'};
  const extended_qs = isNilOrEmpty(extendedElementsKey)
    ? isNilOrEmpty(jobId) ? {where: "extended='true'"} : ''
    : {where: "extended='true' AND key in (" + applyQuotes(extendedElementsKey) + ')'};

    const privateElements = !isNilOrEmpty(private_qs) ? await getPrivateElements(private_qs) : [];
    const allExtendedElements = !isNilOrEmpty(extended_qs) ? await getExtendedElements(extended_qs) : [];

    const privateElementIds = map((e) => e.id, privateElements);
    const extendedElements = allExtendedElements.filter((element) => !privateElementIds.includes(element.id));

    // get private elements
    const privateElementsExport = await downloadElements(privateElements, {}, jobId, processId, true);
    // For private elements, private flag won't get populated if we cloned any system element
    forEach((element) => (element.private = true), privateElementsExport);  
    // get extended elements
    const qs = { extendedOnly: true };
    const extendedElementsExport = await downloadElements(extendedElements, qs, jobId, processId, false);

    return privateElementsExport.concat(extendedElementsExport);
};