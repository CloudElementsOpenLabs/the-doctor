'use strict';
const {mapObjIndexed, values} = require('ramda');
const update = require('../../../util/update');
const {emitter, EventTopic} = require('../../../events/emitter');
const constructEvent = require('../../../events/construct-event');
const {isJobCancelled, removeCancelledJobId} = require('../../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../../constants/artifact');

module.exports = async (vdrs, jobId, processId) => {
  const uploadPromis = mapObjIndexed(async (vdr, vdrName) => {
    try {
      if (isJobCancelled(jobId)) {
        removeCancelledJobId(jobId);
        throw new Error('job is cancelled');
      }
      emitter.emit(
        EventTopic.ASSET_STATUS,
        constructEvent(processId, Assets.VDRS, vdrName, ArtifactStatus.INPROGRESS, '', '', false),
      );
      await update('vdrs/import', vdr);
      console.log(`Upserted VDR: ${vdrName}`)
      emitter.emit(
        EventTopic.ASSET_STATUS,
        constructEvent(processId, Assets.VDRS, vdrName, ArtifactStatus.COMPLETED, '', '', false),
      );
    } catch (error) {
      emitter.emit(
        EventTopic.ASSET_STATUS,
        constructEvent(processId, Assets.VDRS, vdrName, ArtifactStatus.FAILED, error.toString(), '', false),
      );
      throw error;
    }
  }, vdrs);
  return Promise.all(values(uploadPromis));
};
