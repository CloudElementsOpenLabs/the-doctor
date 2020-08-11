'use strict';
const {forEach, join, map, isNil, isEmpty, flatten, pipe, filter, type} = require('ramda');
const get = require('./get');
const applyQuotes = require('./quoteString');
const getExtendedElements = (qs) => get('elements', qs);
const getPrivateElements = (qs) => get('elements', qs);
const makePath = (element) => `elements/${element.id}/export`;
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const downloadElements = async (elements, qs, service) => {
  const downloadPromise = await elements.map(async (element) => {
    try {
      if (service) {
        const jobCancelled = await service.isJobCancelled(service.jobId);
        if (jobCancelled) {
          throw new Error('job is cancelled');
        }
        await service.updateProcessArtifact(service.processId, 'elements', element.key, 'inprogress', '');
      }
      const exportedElement = await get(makePath(element), qs);

      if (service) {
        await service.updateProcessArtifact(service.processId, 'elements', element.key, 'completed', '');
      }
      return exportedElement;
    } catch (error) {
      if (service) {
        await service.updateProcessArtifact(service.processId, 'elements', element.key, 'error', error.toString());
      }
      throw error;
    }
  });
  const elementsExport = await Promise.all(downloadPromise);
  return elementsExport;
};

module.exports = async (keys, service) => {
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
  const privateElementsExport = await downloadElements(privateElements, {}, service);

  // get extended elements
  const qs = {extendedOnly: true};
  const extendedElementsExport = await downloadElements(extendedElements, qs, service);
  forEach((element) => (element.private = true), extendedElementsExport);

  return privateElementsExport.concat(extendedElementsExport);
};
