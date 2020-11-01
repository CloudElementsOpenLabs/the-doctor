'use strict';
const {map, find, propEq, mergeAll, curry, equals, assocPath} = require('ramda');
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const get = require('./get');
const postFormula = require('./post')('formulas');
const makePath = (formula) => `formulas/${formula.id}`;
const update = require('./update');

const createFormula = curry(async (endpointFormulas, jobId, processId, formula) => {
  try {
    const endpointFormula = find(propEq('name', formula.name))(endpointFormulas);
    if (endpointFormula) {
      return {[formula.id]: endpointFormula.id};
    } else {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.FORMULAS,
          assetName: formula.name,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        });
        return null;
      }
      console.log(`Creating formula for formula name - ${formula.name}`);
      const result = await postFormula(formula);
      console.log(`Created formula for formula name - ${formula.name}`);
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formula.name,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      });
      return {[formula.id]: result.id};
    }
  } catch (error) {
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.FAILED,
      error: error.toString(),
      metadata: '',
    });
    throw error;
  }
});

const updateFormula = curry(async (jobId, processId, formula) => {
  try {
    if (isJobCancelled(jobId)) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formula.name,
        assetStatus: ArtifactStatus.CANCELLED,
        error: 'job is cancelled',
        metadata: '',
      });
      return null;
    }
    console.log(`Uploading formula for formula name - ${formula.name}`);
    await update(makePath(formula), formula);
    console.log(`Uploaded formula for formula name - ${formula.name}`);
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.COMPLETED,
      metadata: '',
    });
  } catch (error) {
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.FAILED,
      error: error.toString(),
      metadata: '',
    });
    throw error;
  }
});

module.exports = async (formulas, jobId, processId) => {
  try {
    const endpointFormulas = await get('formulas', '');
    let formulaIds = mergeAll(await Promise.all(map(createFormula(endpointFormulas, jobId, processId))(formulas)));
    const fixSteps = map((step) =>
      equals(step.type, 'formula')
        ? assocPath(['properties', 'formulaId'], formulaIds[step.properties.formulaId] || -1, step)
        : step,
    );
    const newFormulas = map((formula) => ({
      ...formula,
      id: formulaIds[formula.id],
      steps: fixSteps(formula.steps),
      subFormulas: formula.subFormulas
        ? map((step) => ({
            ...step,
            id: formulaIds[step.id],
            steps: fixSteps(step.steps),
          }))(formula.subFormulas)
        : [],
    }))(formulas);
    console.log(`Initiating the upload process for formulas`);
    return Promise.all(map(updateFormula(jobId, processId))(newFormulas));
  } catch (error) {
    throw error;
  }
};
