'use strict';

const { isEmpty } = require('ramda');
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
    const vdrNames = Array.isArray(options.name)
      ? options.name.map((vdr) => vdr.name)
      : options.name.split(',');
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
  const vdrNames = Array.isArray(options.name)
    ? options.name.map((vdr) => vdr.name)
    : options.name.split(',');
  const service = options.service;
  vdrNames && vdrNames.forEach(async (vdrName) => {
    let vdr = options.file ? await readFile(options.file) : await buildVdrsFromDir(options.dir, vdrName)
    if (!vdr || isEmpty(vdr)) {
      console.log('The doctor was unable to find any vdr called ${vdrName}')
    } else {
      try {
        if (service) {
          const cancelled = await service.isJobCancelled(service.jobId);
          if (cancelled) {
            throw new Error('job is cancelled');
          }
          await service.updateProcessArtifact(service.processId, 'vdrs', vdrName, 'inprogress', '');
        }
        await upsertVdrs(vdr);
        if (service) {
          await service.updateProcessArtifact(service.processId, 'vdrs', vdrName, 'completed', '');
        }
      } catch (error) {
        if (service) {
          await service.updateProcessArtifact(service.processId, 'vdrs', vdrName, 'error', error.toString());
        }
        throw error;
      }
    }
  })
}
