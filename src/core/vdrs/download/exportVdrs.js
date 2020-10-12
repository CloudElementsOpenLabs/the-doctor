'use strict';
const {isNil, pipe, reject, isEmpty, indexBy, prop} = require('ramda');
const get = require('../../../util/get');
const {emitter, EventTopic} = require('../../../events/emitter');
const {isJobCancelled} = require('../../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../../constants/artifact');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);
const transduceVdrs = (vdrs) => (!isNilOrEmpty(vdrs) ? pipe(reject(isNil), indexBy(prop('vdrName'))) : {});

const downloadVdrs = async (vdrNames, jobId, processId) => {
  const downloadPromise = await vdrNames.map(async (vdrName) => {
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.VDRS,
          assetName: vdrName,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        });
        return null;
      }
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdrName,
        assetStatus: ArtifactStatus.INPROGRESS,
        metadata: '',
      });
      const exportedVdr = await get(`/vdrs/${vdrName}/export`, '');
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdrName,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      });
      return !isNilOrEmpty(exportedVdr) ? exportedVdr : {};
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdrName,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: '',
      });
      throw error;
    }
  });
  const vdrsExport = await Promise.all(downloadPromise);
  return transduceVdrs(vdrsExport);
};

module.exports = async (vdrNames, inputVdrs, jobId, processId) => {
  const vdrs = await downloadVdrs(vdrNames, jobId, processId);
  const newlyCreated =
    inputVdrs && Array.isArray(inputVdrs) ? inputVdrs.filter((vdr) => !vdrNames.includes(vdr.name)) : [];
  newlyCreated.forEach((vdr) =>
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.VDRS,
      assetName: vdr.name,
      metadata: '',
      isNew: true,
    }),
  );
  return vdrs;
};
