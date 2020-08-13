'use strict';

const get = require('../../../util/get');
const { emitter, EventTopic } = require('../../../events/emitter');
const constructEvent = require('../../../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../../../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../../../constants/artifact');

module.exports = async (vdrNames, inputVdrs, jobId, processId) => {
  let vdrs = {};
  for (var index = 0; index < vdrNames.length; index++) {
    let vdr = null;
    try {
      if (isJobCancelled(jobId)) {
        removeCancelledJobId(jobId);
        throw new Error('job is cancelled');
      }
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdrNames[index], ArtifactStatus.INPROGRESS, '', '', false));
      vdr = await get(`/vdrs/${vdrNames[index]}/export`, "");
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdrNames[index], ArtifactStatus.COMPLETED, '', '', false));
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdrNames[index], ArtifactStatus.FAILED, error.toString(), '', false));
      throw error;
    }
    vdrs[vdrNames[index]] = vdr;
  }
  const newlyCreated = inputVdrs && Array.isArray(inputVdrs) ? inputVdrs.filter(vdr => {
    return !vdrNames.includes(vdr.name);
  }) : [];
  newlyCreated.forEach(vdr => {
    emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdr.name, ArtifactStatus.COMPLETED, '', '', true));
  })


  return vdrs;
};