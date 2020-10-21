'use strict';
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const {forEach, isNil, isEmpty, equals, pipe, reject} = require('ramda');
const get = require('./get');
const getExtendedElements = require('./getExtendedElements');
const getPrivateElements = require('./getPrivateElements');
const makePath = (element) => `elements/${element.id}/export`;
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);
const clearNull = pipe(reject(isNil));

const downloadElements = async (elements, query, jobId, processId, isPrivate) => {
  console.log(`Initiating the download process for elements`);
  const downloadPromises = await elements.map(async (element) => {
    const elementMetadata = JSON.stringify({private: isPrivate});
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: elementMetadata,
        });
        return null;
      }
      console.log(`Downloading element for element key - ${element.key}`);
      const exportedElement = await get(makePath(element), query);
      console.log(`Downloaded element for element key - ${element.key}`);
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: elementMetadata,
      });
      return !isNilOrEmpty(exportedElement) ? exportedElement : {};
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: elementMetadata,
      });
      throw error;
    }
  });
  const elementsExport = await Promise.all(downloadPromises);
  return clearNull(elementsExport);
};

module.exports = async (elementKeys, jobId, processId) => {
  // From CLI - User can pass comma seperated string of elementKeys
  // From Doctor-service - elementKeys will be in Array of objects containing key and private flag
  try {
    const allExtendedElements = await getExtendedElements(elementKeys, jobId);
    const extendedElements = !isNilOrEmpty(allExtendedElements)
      ? allExtendedElements.filter((element) => element.extended && !element.private)
      : [];
    const privateElements = await getPrivateElements(elementKeys, jobId);
    // Fetch all the private elements again to get all required/hydrated fields.
    const privateElementsExport = await downloadElements(privateElements, {}, jobId, processId, /* isPrivate */ true);
    // For private elements, private flag won't get populated if we cloned any system element
    !isNilOrEmpty(privateElementsExport) && forEach((element) => (element.private = true), privateElementsExport);
    // Fetch all the extended elements again to get all required/hydrated fields.
    const extendedElementsExport = await downloadElements(
      extendedElements,
      {extendedOnly: true},
      jobId,
      processId,
      /* isPrivate */ false,
    );
    const elements = isNilOrEmpty(privateElementsExport)
      ? isNilOrEmpty(extendedElementsExport)
        ? []
        : extendedElementsExport
      : isNilOrEmpty(extendedElementsExport)
      ? privateElementsExport
      : privateElementsExport.concat(extendedElementsExport);
    const newlyCreatedElements =
      !isNilOrEmpty(elementKeys) && Array.isArray(elementKeys)
        ? elementKeys.filter(
            (elementKey) =>
              elementKey.private && !privateElements.some((element) => equals(element.key, elementKey.key)),
          )
        : [];
    newlyCreatedElements.forEach((element) =>
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        metadata: JSON.stringify({private: true}),
        isNew: true,
      }),
    );
    return elements;
  } catch (error) {
    throw error;
  }
};
