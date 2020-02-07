'use strict';

const {curry} = require('ramda');
const fs = require('fs');
const get = require('./get');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
} 

const getStepValues = async execution =>{
    let steps = execution.stepExecutions;
    let stepValues = [];
    await asyncForEach(steps, async (step)=>{
      //todo do - add error handling for empty step values. These expire after 72 hours 
      //and as of now just print an empty file
        let myRet = await get(`formulas/instances/executions/steps/${step.id}/values`);
        step.stepValues = myRet;
        stepValues.push(step);
    })
    return stepValues;
}

module.exports = curry(async (fileName, data) => {
  let executionWithStepValues = await getStepValues( await data);
  fs.writeFileSync(fileName, JSON.stringify(executionWithStepValues, null, 2), 'utf8')
});