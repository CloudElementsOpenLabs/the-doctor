'use strict';
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const {forEachObjIndexed, isEmpty} = require('ramda');
const remove = require('../util/remove');
const getVdrs = require('./vdrs/download/getVdrs');
const makePath = (vdrname) => `common-resources/${vdrname}`;

module.exports = async (options) => {
  const {name, jobId, processId} = options;
  const vdrs = await getVdrs(name);
  if (isEmpty(vdrs)) {
    console.log(`The doctor was unable to find the vdrs ${name}.`);
    return;
  }
  console.log(`Initiating the delete process for VDRs`);
  await forEachObjIndexed(async (vdr) => {
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.VDRS,
          assetName: vdr.vdrName,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        });
        return null;
      }
      console.log(`Deleting VDR for VDR name - ${vdr.vdrName}`);
      await remove(makePath(vdr.vdrName), {force: true});
      console.log(`Deleted VDR for VDR name - ${vdr.vdrName}`);
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdr.vdrName,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      });
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdr.vdrName,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: '',
      });
      throw error;
    }
  }, vdrs);
};
