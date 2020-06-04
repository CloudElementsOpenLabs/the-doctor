'use strict';

const { pipe, pipeP, cond, prop, isNil, not, useWith, __ } = require('ramda');
const readFile = require('../../../util/readFile');
const applyVersion = require('../../../util/applyVersion')
const buildVdrsFromDir = require('./readVdrsFromDir');
const upsertVdrs = require('./upsertVdrs');
const importCommonResources = require('../../importCommonResources')
const { promisify } = require('util');
const { readdir, existsSync } = require('fs');
const { join } = require('path');

const checkIfOldVdrFormat = async (options) => {
  if (options.file) {
    const payloadFromFile = await readFile(options.file);
    for (let [vdrName, payload] of Object.entries(payloadFromFile)) {
      if (payload && payload.vdrVersion && (payload.vdrVersion === 'v1' || payload.vdrVersion === 'v2')) {
        return false;
      }
    }
  } else {
    const vdrNames = await promisify(readdir)(options.dir)
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
    importCommonResources(options);
    return;
  }
  cond([
    [
      pipe(prop('file'), isNil, not),
      pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options), upsertVdrs)
    ],
    [
      pipe(prop('dir'), isNil, not),
      pipeP(useWith(buildVdrsFromDir, [prop('dir')]), applyVersion(__, options), upsertVdrs)
    ]
  ])(options)
}
