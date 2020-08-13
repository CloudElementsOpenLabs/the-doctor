'use strict';

const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../constants/artifact');

const { forEachObjIndexed } = require('ramda');
const remove = require('../util/remove');
const getVdrs = require('./vdrs/download/getVdrs');

const makePath = (vdrname) => `common-resources/${vdrname}`;

module.exports = async options => {
  const { name, jobId, processId } = options;

  const vdrs = await getVdrs(name);

  await forEachObjIndexed(async (vdr, vdrName) => {
    try {
      if (isJobCancelled(jobId)) {
          removeCancelledJobId(jobId);
          throw new Error('job is cancelled');
      }
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdr.vdrName, ArtifactStatus.INPROGRESS, '', '', false));
      await remove(makePath(vdr.vdrName), { force: true });
      console.log(`Deleted VDR: ${vdr.vdrName}.`);
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdr.vdrName, ArtifactStatus.COMPLETED, '', '', false));
  } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.VDRS, vdr.vdrName, ArtifactStatus.FAILED, error.toString(), '', false));
      throw error;
  }

  }, vdrs);
}