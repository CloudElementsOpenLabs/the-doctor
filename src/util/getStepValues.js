'use strict';

const get = require('./get');

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index]);
    }
} 
  
module.exports = async execution => {
    let steps = execution.stepExecutions;
    let stepValues = [];
    await asyncForEach(steps, async (step)=>{
        let stepValue = await get(`formulas/instances/executions/steps/${step.id}/values`);
        //todo do - add error handling for empty step values. These expire after 72 hours 
        //and as of now just print an empty file.  May want to check the time stamp is 72+ hrs old as well.
        // stepValue[0] = undefined;
        if(!stepValue[0]) console.log(`No execution data found for ${step.id}. Executions data expires after 72 hours.`)
        step.stepValues = stepValue;
        stepValues.push(step);
    })
    return stepValues;
}