'use strict';
const {
  pipe,
  pipeP,
  cond,
  prop,
  isNil,
  not,
  useWith,
  __,
  isEmpty,
  propOr,
  has,
  equals,
  type,
  curry,
  assoc,
  forEachObjIndexed,
} = require('ramda');
const readFile = require('../../../util/readFile');
const applyVersion = require('../../../util/applyVersion');
const buildVdrsFromDir = require('./readVdrsFromDir');
const upsertVdrs = require('./upsertVdrs');
const createObjectDefinitions = require('../../../util/createObjectDefinitions');
const createTransformations = require('../../../util/createTransformations');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

const importVdrsV1 = async (commonResources, options) => {
  // From CLI - User can pass comma seperated string of vdrs name
  // From Service - It will be in Array of objects containing vdr name
  if (isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
    const vdrNames = Array.isArray(options.name) ? options.name.map((vdr) => vdr.name) : options.name.split(',');
    vdrNames &&
      vdrNames.forEach(async (vdrName) => {
        let transformations = {};
        forEachObjIndexed((element, elementKey) => {
          if (!isNilOrEmpty(element[vdrName])) {
            transformations[elementKey] = {};
            transformations[elementKey][vdrName] = element[vdrName];
          }
        })(commonResources.transformations);
        commonResources.objectDefinitions = commonResources.objectDefinitions[vdrName]
          ? {[vdrName]: commonResources.objectDefinitions[vdrName]}
          : {};
        commonResources.transformations = transformations;

        if (isNilOrEmpty(commonResources.objectDefinition) && isNilOrEmpty(commonResources.transformations)) {
          console.log(`The doctor was unable to find any vdr called ${vdrName}`);
          return;
        }
      });
  }
  await pipeP(createObjectDefinitions, createTransformations)(commonResources);
};

const importVdrsV2 = async (vdrs, options) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Service - It will be in Array of objects containing elementKey and private flag structure
  let vdrsToImport = {};
  if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
    const vdrNames = Array.isArray(options.name) ? options.name.map((vdr) => vdr.name) : options.name.split(',');
    vdrNames &&
      vdrNames.forEach((vdrName) => {
        const vdrToImport = propOr({}, vdrName)(vdrs);
        if (isNilOrEmpty(vdrToImport)) {
          console.log(`The doctor was unable to find the vdr ${vdrName}.`);
        } else {
          vdrsToImport = assoc(vdrName, vdrToImport, vdrsToImport);
        }
      });
  }
  vdrsToImport = isNilOrEmpty(vdrsToImport) ? vdrs : vdrsToImport;
  await upsertVdrs(vdrsToImport, options.jobId, options.processId);
};

const importVdrs = curry(async (vdrs, options) => {
  if (has('objectDefinitions', vdrs) && has('transformations', vdrs)) {
    await importVdrsV1(vdrs, options);
  } else {
    await importVdrsV2(vdrs, options);
  }
});

module.exports = async (options) => cond([
  [
    pipe(prop('file'), isNil, not),
    pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options), importVdrs(__, options)),
  ],
  [
    pipe(prop('dir'), isNil, not),
    pipeP(useWith(buildVdrsFromDir, [prop('dir')]), applyVersion(__, options), importVdrs(__, options)),
  ],
])(options);
