'use strict';

const { isEmpty } = require('ramda');
const { emitter, EventTopic } = require('../../../events/emitter');
const constructEvent = require('../../../events/construct-event');
const { isJobCancelled } = require('../../../events/cancelled-job');

const readFile = require('../../../util/readFile');
const buildVdrsFromDir = require('./readVdrsFromDir');
const upsertVdrs = require('./upsertVdrs');
const importCommonResource = require('../../importCommonResource')
const { join } = require('path');
const { existsSync } = require('fs');

const checkIfOldVdrFormat = async (options) => {
  const vdrName = options.name
  if (options.file) {
    let payload = await readFile(options.file);
    payload = payload[vdrName];
    if (payload && payload.vdrVersion && (payload.vdrVersion === 'v1' || payload.vdrVersion === 'v2')) {
      return false;
    }
  } else {
    const vdrNames = options.name.split(',')
    for (const vdrName of vdrNames) {
      const fileLocation = join(options.dir, vdrName, `${vdrName}.json`);

      if (existsSync(fileLocation)) {
        const payload = await readFile(fileLocation);
        if (payload && payload.vdrVersion && (payload.vdrVersion === 'v1' || payload.vdrVersion === 'v2')) {
          return false;
        }
      }
    }
  }
  return true;
}


module.exports = async options => {
  if (await checkIfOldVdrFormat(options)) {
    await importCommonResource(options);
    return;
  }
  const vdrNames = options.name.split(',')
  const { jobId, processId } = options;

  let uploadPromise = await vdrNames.map(async (vdrName) => {
    let vdr = options.file ? await readFile(options.file) : await buildVdrsFromDir(options.dir, vdrName)
    if (!vdr || isEmpty(vdr)) {
      console.log('The doctor was unable to find any vdr called ${vdrName}')
    } else {
      try {
        if (isJobCancelled(jobId)) {
          throw new Error('job is cancelled');
        }
        emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'vdrs', vdrName, 'inprogress', ''));
        await upsertVdrs(vdr);
        emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'vdrs', vdrName, 'completed', ''));
      } catch (error) {
        emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'vdrs', vdrName, 'error', error.toString()));
        throw error;
      }
    }
  });
  await Promise.all(uploadPromise);
}
