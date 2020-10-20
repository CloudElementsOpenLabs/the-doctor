'use strict';
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const getPrivateElements = require('../util/getPrivateElements');
const remove = require('../util/remove');
const {isEmpty} = require('ramda');
const makePath = (id) => `elements/${id}`;

module.exports = async (options) => {
  const {name, jobId, processId} = options;
  const elements = await getPrivateElements(name);
  if (isEmpty(elements)) {
    console.log(`The doctor was unable to find the element ${name}.`);
    return;
  }
  console.log(`Initiating the delete process for elements`);
  const removePromises = await elements.map(async (element) => {
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        });
        return null;
      }
      console.log(`Deleting element for element key - ${element.key}`);
      await remove(makePath(element.id));
      console.log(`Deleted element for element key - ${element.key}.`);
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      });
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: '',
      });
      throw error;
    }
  });
  Promise.all(removePromises);
};
