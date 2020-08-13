'use strict';

const get = require('../../../util/get');
const { emitter, EventTopic } = require('../../../events/emitter');
const constructEvent = require('../../../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../../../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../../../constants/artifact');

module.exports = async (vdrNames, jobId, processId) => {
  let vdrs = {};
  for (var index = 0; index < vdrNames.length; index++) {
    let vdr = null;
    try {
      if (isJobCancelled(jobId)) {
        removeCancelledJobId(jobId);
        throw new Error('job is cancelled');
      }
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdrNames[index], ArtifactStatus.INPROGRESS, ''));
      vdr = await get(`/vdrs/${vdrNames[index]}/export`, "");
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdrNames[index], ArtifactStatus.COMPLETED, ''));
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdrNames[index], ArtifactStatus.FAILED, error.toString()));
      throw error;
    }
    vdrs[vdrNames[index]] = vdr;
  }
  return vdrs;
};