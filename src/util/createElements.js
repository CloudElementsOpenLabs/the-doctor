'use strict';
const {isNil, find, propEq, findIndex, isEmpty, equals} = require('ramda');
const {emitter, EventTopic} = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const {isJobCancelled, removeCancelledJobId} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');

const getElements = require('./getElements');
const get = require('./get');
const createElement = require('./post')('elements');
const post = require('./post');
const makePath = (element) => `elements/${element.key}`;
const update = require('./update');
const min = (arr) =>
  arr.map((x) => {
    return {methodPath: x.path + x.method};
  });
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const isNewElementToCreate = (allElements, elementToImport) => {
  // Here we need to identify whether the element is already present or not
  // Get all the elements at user account level and check the existence of the element
  const existingElements = !isNilOrEmpty(allElements)
    ? allElements.filter(
        (element) =>
          equals(element.key, elementToImport.key) && equals(existingElement.private, elementToImport.private),
      )
    : [];
  return isNilOrEmpty(existingElements);
};

module.exports = async (elements, jobId, processId) => {
  const allElements = await getElements();
  let uploadPromise = await elements.map(async (element) => {
    try {
      if (isJobCancelled(jobId)) {
        removeCancelledJobId(jobId);
        throw new Error('job is cancelled');
      }
      emitter.emit(
        EventTopic.ASSET_STATUS,
        constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.INPROGRESS, ''),
      );

      if (!isNewElementToCreate(allElements, element)) {
        if (element.private === true || element.actuallyExtended === false) {
          await update(makePath(element), element);
          console.log(`Updated Element: ${element.key}`);
        } else {
          //extend the element
          // TODO
          // GET resources from destination to compare
          const resources = await get(`elements/${element.key}/resources`, '');
          const destinationResources = resources.filter((resource) => resource.ownerAccountId !== 1);

          //combination of path + method is uniquq per element per account
          const compDestination = min(destinationResources);
          const compOrigin = min(element.resources);

          let toUpload = {create: [], update: []};
          // 2, Compare GET/resources to the resources in the saved element
          for (let i = 0; i < compOrigin.length; i++) {
            const exists = findIndex(propEq('methodPath', compOrigin[i].methodPath))(compDestination);
            console.log(`Element Exteneded: ${element.key}`);
            if (exists > -1) {
              // 3. If resource already exist - PUT
              console.log('destinationResources[exists].id', destinationResources[exists].id);
              toUpload.update.push(
                update(`elements/${element.key}/resources/${destinationResources[exists].id}`, element.resources[i]),
              );
              console.log(
                `    Resource Updated:\n        Method: ${element.resources[i].method}\n        Path: ${element.resources[i].path}`,
              );
            } else {
              // 4. If resource doesn't exist - POST
              toUpload.create.push(post(`elements/${element.key}/resources`, element.resources[i]));
              console.log(
                `    Resource Created:\n        Method: ${element.resources[i].method}\n        Path: ${element.resources[i].path}`,
              );
            }
          }

          //combine arrays of promises
          let arrs = toUpload.create.concat(toUpload.update);
          await Promise.all(arrs);
        }
      } else {
        if (element.private === true || element.actuallyExtended === false) {
          //create non-extended element
          await createElement(element);
          console.log(`Created Element: ${element.key}`);
        } else {
          let toUpload = {create: [], update: []};
          for (let i = 0; i < element.resources.length; i++) {
            toUpload.create.push(post(`elements/${element.key}/resources`, element.resources[i]));
            console.log(
              `    Resource Created:\n        Method: ${element.resources[i].method}\n        Path: ${element.resources[i].path}`,
            );
          }
          //combine arrays of promises
          let arrs = toUpload.create.concat(toUpload.update);
          await Promise.all(arrs);
        }
      }
      emitter.emit(
        EventTopic.ASSET_STATUS,
        constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.COMPLETED, ''),
      );
    } catch (error) {
      emitter.emit(
        EventTopic.ASSET_STATUS,
        constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.FAILED, error.toString()),
      );
      throw error;
    }
  });
  await Promise.all(uploadPromise);
};
