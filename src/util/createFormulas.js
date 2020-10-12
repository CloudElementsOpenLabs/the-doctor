'use strict';
const {map, find, propEq, mergeAll, curry, equals} = require('ramda');
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const get = require('./get');
const postFormula = require('./post')('formulas');
const makePath = (formula) => `formulas/${formula.id}`;
const update = require('./update');

const createFormula = curry(async (endpointFormulas, formula) => {
  try {
    const endpointFormula = find(propEq('name', formula.name))(endpointFormulas);
    if (endpointFormula) {
      return {[formula.id]: endpointFormula.id};
    } else {
      const result = await postFormula(formula);
      console.log(`Created Formula: ${formula.name}`);
      return {[formula.id]: result.id};
    }
  } catch (error) {
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
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.INPROGRESS,
      metadata: '',
    });
    await update(makePath(formula), formula);
    console.log(`Updated Formula: ${formula.name}`);
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
    let formulaIds = mergeAll(await Promise.all(map(createFormula(endpointFormulas))(formulas)));
    const fixSteps = map((step) =>
      equals(step.type, 'formula')
        ? {...step, properties: {formulaId: formulaIds[step.properties.formulaId] || -1}}
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
    return Promise.all(map(updateFormula(jobId, processId))(newFormulas));
  } catch (error) {
    throw error;
  }
};
