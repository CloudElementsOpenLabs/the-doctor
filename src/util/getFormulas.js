'use strict';
const {type, join} = require('ramda');
const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../constants/artifact');
const get = require('./get');
const applyQuotes = require('./quoteString');


// Unlike vdrs and formulas export, formulas download is a single call and we cant split the status update to each asset
const updateFormulasStatus = (processId, formulaNames, status, error) => {
  for (const index in formulaNames) {
    emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.FORMULAS, formulaNames[index], status, error));
  }
}
module.exports = async (keys, jobId, processId) => {
  let param = '';
  let formulaNames = [];
  if (type(keys) === 'String') {
    formulaNames = keys.split(',');
    param = {where: 'name in (' + applyQuotes(join(', ', formulaNames)) + ')'};
  } else if (Array.isArray(keys)) {
    formulaNames = keys.map((formula) => formula.name);
    param = {where: 'name in (' + applyQuotes(join(', ', formulaNames)) + ')'};
  } else {
    return get('formulas', param);
  }
  try {
    if (isJobCancelled(jobId)) {
      removeCancelledJobId(jobId);
      throw new Error('job is cancelled');
    }
    updateFormulasStatus(processId, formulaNames, ArtifactStatus.INPROGRESS, '');
    const result = await get('formulas', param);
    updateFormulasStatus(processId, formulaNames, ArtifactStatus.COMPLETED, '');

    return result;
  } catch (error) {
    updateFormulasStatus(processId, formulaNames, ArtifactStatus.FAILED, error.toString());
    throw error;
  }
}
