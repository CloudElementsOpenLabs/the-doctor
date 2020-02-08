'use strict';

const get = require('./get');
const asyncForEach = require('./asyncForEach');
const logError = step => console.log(`No step values found for step ${step.stepName}. Execution data expires after 72 hours.`);

module.exports = async execution => {
    let steps = execution.stepExecutions;
    let stepValues = [];

    await asyncForEach(steps, async (step)=>{
        let stepValue = await get(`formulas/instances/executions/steps/${step.id}/values`);
        if(!stepValue[0]) {
            logError(step);
            step.stepValues = [];
        }else {
            step.stepValues = stepValue; 
        }
        stepValues.push(step);
    })
    execution.stepExecutions = stepValues;
    return execution;
}