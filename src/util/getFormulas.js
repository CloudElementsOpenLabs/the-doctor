'use strict';
const {type, join} = require('ramda');
const get = require('./get');
const applyQuotes = require('./quoteString');

module.exports = async (keys, service) => {
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
    if (service) {
      const cancelled = await service.isJobCancelled(service.jobId);
      if (cancelled) {
        throw new Error('job is cancelled');
      }
      for (const index in formulaNames) {
        await service.updateProcessArtifact(service.processId, 'formulas', formulaNames[index], 'inprogress', '');
      }
    }
    const result = await get('formulas', param);

    if (service) {
      for (const index in formulaNames) {
        await service.updateProcessArtifact(service.processId, 'formulas', formulaNames[index], 'completed', '');
      }
    }
    return result;
  } catch (error) {
    if (service) {
      for (const index in formulaNames) {
        await service.updateProcessArtifact(
          service.processId,
          'formulas',
          formulaNames[index],
          'error',
          error.toString(),
        );
      }
    }
    throw error;
  }
};
