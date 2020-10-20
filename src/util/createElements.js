'use strict';
const {isNil, isEmpty, equals, concat, find, filter, propOr, pipe, pluck, uniq, join, has, toLower} = require('ramda');
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const applyQuotes = require('./quoteString');
const getExtendedElements = require('./getExtendedElements');
const getPrivateElements = require('./getPrivateElements');
const get = require('./get');
const post = require('./post');
const createElement = require('./post')('elements');
const makePath = (element) => `elements/${element.key}`;
const update = require('./update');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const fetchAllElements = async (elementsToImport) => {
  const elementsKeyString = !isNilOrEmpty(elementsToImport)
    ? pipe(pluck('key'), uniq, join(','))(elementsToImport)
    : '';
  const privateElements = await getPrivateElements(elementsKeyString);
  const allExtendedElements = await getExtendedElements(elementsKeyString);
  const extendedElements = !isNilOrEmpty(allExtendedElements)
    ? allExtendedElements.filter((element) => element.extended && !element.private)
    : [];
  return concat(privateElements, extendedElements);
};

const fetchExtendedAndPrivateResources = async (existingElementId, elementKey) => {
  // GET /resources will always return private element resources if exists
  let extendedResources;
  if (isNilOrEmpty(existingElementId)) {
    extendedResources = await get(`elements/${elementKey}/resources`, '');
  } else {
    const extendedElement = await get(`elements/${existingElementId}`, '');
    extendedResources = propOr([], 'resources')(extendedElement);
  }
  return !isNilOrEmpty(extendedResources)
    ? filter((resource) => !equals(resource.ownerAccountId, 1), extendedResources)
    : [];
};

module.exports = async (elements, jobId, processId) => {
  console.log(`Initiating the upload process for elements`);
  const allElements = await fetchAllElements(elements);
  let uploadPromise = await elements.map(async (element) => {
    // Here we need to identify whether the element is already present or not
    // Get all the elements at user account level and check the existence of the element
    const existingElement = !isNilOrEmpty(allElements)
      ? find((searchElement) =>
          equals(toLower(element.key), toLower(searchElement.key))
            ? has('private', element)
              ? equals(element.private, searchElement.private) && !searchElement.extended
              : equals(element.extended, searchElement.extended) && !searchElement.private
            : false,
        )(allElements)
      : [];
    const elementMetadata = equals(element.private, true)
      ? JSON.stringify({private: true})
      : JSON.stringify({private: false});
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
      console.log(`Uploading element for element key - ${element.key}`);
      if (isNilOrEmpty(existingElement)) {
        // Element doesn't exists in the db for given account
        if (element.private === true || element.actuallyExtended === false) {
          // Create non-extended element (Private element)
          const importedElement = await createElement(element);
          console.log(`Uploaded element for element key - ${element.key}`);
          emitter.emit(EventTopic.ASSET_STATUS, {
            processId,
            assetType: Assets.ELEMENTS,
            assetName: element.key,
            assetStatus: ArtifactStatus.COMPLETED,
            metadata: elementMetadata,
          });
          console.log(`Created Element: ${element.key}`);
          return importedElement;
        } else {
          let promisesList = {createdResources: [], updatedResources: []};
          if (!isNilOrEmpty(element.resources)) {
            // If we try to create resource based on element key then it will always
            // create resource in private element if exists
            const elementsForKey = await get('elements', {where: 'key = ' + applyQuotes(element.key)});
            const systemElementToExtend = !isNilOrEmpty(elementsForKey)
              ? find((searchElement) =>
                  equals(element.key, searchElement.key) && has('private', searchElement)
                    ? !searchElement.private
                    : false,
                )(elementsForKey)
              : [];

            if (isNilOrEmpty(systemElementToExtend) || isNilOrEmpty(systemElementToExtend.id)) {
              element.resources.forEach((resource) => {
                promisesList.createdResources.push(post(`elements/${element.key}/resources`, resource));
                console.log(`Resource Created: ${resource.method} - ${resource.path}`);
              });
            } else {
              element.resources.forEach((resource) => {
                promisesList.createdResources.push(post(`elements/${systemElementToExtend.id}/resources`, resource));
                console.log(`Resource Created: ${resource.method} - ${resource.path}`);
              });
            }
          }
          console.log(`Uploaded element for element key - ${element.key}`);
          emitter.emit(EventTopic.ASSET_STATUS, {
            processId,
            assetType: Assets.ELEMENTS,
            assetName: element.key,
            assetStatus: ArtifactStatus.COMPLETED,
            metadata: elementMetadata,
          });
          // Combine both the promises list and resolve all
          const allPromisesToResolve = concat(promisesList.createdResources, promisesList.updatedResources);
          await Promise.all(allPromisesToResolve);
        }
      } else {
        // Element exists in the db for given account
        if (element.private === true || element.actuallyExtended === false) {
          // Create non-extended element (Private element)
          const importedElement = await update(makePath(element), element);
          console.log(`Uploaded element for element key - ${element.key}`);
          emitter.emit(EventTopic.ASSET_STATUS, {
            processId,
            assetType: Assets.ELEMENTS,
            assetName: element.key,
            assetStatus: ArtifactStatus.COMPLETED,
            metadata: elementMetadata,
          });
          return importedElement;
        } else {
          // Extend the element resources and element configurations (TODO)
          let promisesList = {createdResources: [], updatedResources: []};
          const extendedResources = await fetchExtendedAndPrivateResources(existingElement.id, element.key);
          if (!isNilOrEmpty(element.resources)) {
            element.resources.forEach((resource) => {
              const existingResource = find(
                (extendedResource) =>
                  equals(extendedResource.method, resource.method) &&
                  equals(extendedResource.path, resource.path) &&
                  equals(extendedResource.type, resource.type),
              )(extendedResources);
              if (isNilOrEmpty(existingResource)) {
                promisesList.createdResources.push(post(`elements/${existingElement.id}/resources`, resource));
                console.log(`Resource Created: ${resource.method} - ${resource.path}`);
              } else {
                promisesList.updatedResources.push(
                  update(`elements/${existingElement.id}/resources/${existingResource.id}`, resource),
                );
                console.log(`Resource Updated: ${resource.method} - ${resource.path}`);
              }
            });
          }
          console.log(`Uploaded element for element key - ${element.key}`);
          emitter.emit(EventTopic.ASSET_STATUS, {
            processId,
            assetType: Assets.ELEMENTS,
            assetName: element.key,
            assetStatus: ArtifactStatus.COMPLETED,
            metadata: elementMetadata,
          });
          // Combine both the promises list and resolve all
          const allPromisesToResolve = concat(promisesList.createdResources, promisesList.updatedResources);
          await Promise.all(allPromisesToResolve);
        }
      }
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
  await Promise.all(uploadPromise);
};
