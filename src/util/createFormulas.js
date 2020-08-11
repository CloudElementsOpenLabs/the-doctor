'use strict';
const {map, find, propEq, mergeAll, curry, pipeP} = require('ramda');
const get = require('./get');
const postFormula = require('./post')('formulas');
const applyVersion = require('../util/applyVersion')
const makePath = formula => `formulas/${formula.id}`;
const update = require('./update');

const createFormula = curry(async (endpointFormulas,formula) => {
    const endpointFormula = find(propEq('name' ,formula.name))(endpointFormulas)
    if(endpointFormula) {
        return { [formula.id]: endpointFormula.id }
    } else {
        const result = await postFormula(formula)
        console.log(`Created Formula: ${formula.name}`)
        return { [formula.id]: result.id }
    }
})

const updateFormula = curry(async (service, formula) => {
  try {
    if (service) {
      const cancelled = await service.isJobCancelled(service.jobId);
      if (cancelled) {
        throw new Error('job is cancelled');
      }
      await service.updateProcessArtifact(service.processId, 'formulas', formula.name, 'inprogress', '');
    }

    await update(makePath(formula), formula)
    if (service) {
      await service.updateProcessArtifact(service.processId, 'formulas', formula.name, 'completed', '');
    }
  } catch (error) {
    if (service) {
      await service.updateProcessArtifact(service.processId, 'formulas', formula.name, 'error', error.toString());
    }
    throw error;
  }
  console.log(`Updated Formula: ${formula.name}`)
})

module.exports = async (formulas, service) => {
    const endpointFormulas = await get('formulas',"")
    let formulaIds = mergeAll(await Promise.all(map(createFormula(endpointFormulas))(formulas)))
    const fixSteps = map(s => s.type === 'formula'? ({ ...s, properties: { formulaId: formulaIds[s.properties.formulaId] } }) : s)
    const newFormulas = map(f => ({
            ...f,
            id: formulaIds[f.id],
            steps: fixSteps(f.steps),
            subFormulas: f.subFormulas ? map(s => ({
                    ...s, 
                    id: formulaIds[s.id],
                    steps: fixSteps(s.steps)
                }))(f.subFormulas) : []
            }))(formulas)
    return Promise.all(map(updateFormula(service))(newFormulas));
}