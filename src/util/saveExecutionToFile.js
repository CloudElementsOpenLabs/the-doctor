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
        let myRet = await get(`formulas/instances/executions/steps/${step.id}/values`);
        stepValues.push(myRet[0]);
    })
    console.log("stepValues: ", stepValues);
}

module.exports = curry(async (fileName, data) => {
  let stepValues = getStepValues(await data);
  //Need an await here becuase fs.writeFileSync runs before we finish getting execution data
  fs.writeFileSync(fileName, JSON.stringify((await data), null, 2), 'utf8')
});