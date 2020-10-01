const {existsSync, mkdirSync, writeFileSync} = require('fs');
const {forEach, map, dissoc, omit, when, dissocPath, pipe, tap} = require('ramda');
const sortobject = require('deep-sort-object');
const {toDirectoryName} = require('./regex');

const addStep = (stepName, stepsMap, sortedSteps) => {
  const step = stepsMap[stepName];
  if (!sortedSteps.includes(step)) {
    sortedSteps.push(step);
    forEach((nextStepName) => {
      addStep(nextStepName, stepsMap, sortedSteps);
    })(step.onSuccess);

    forEach((nextStepName) => {
      addStep(nextStepName, stepsMap, sortedSteps);
    })(step.onFailure);
  }
};

const sortSteps = (formula) => {
  let sortedSteps = [];
  const stepsMap = formula.steps.reduce((stepsMap, step) => {
    stepsMap[step.name] = step;
    return stepsMap;
  }, {});
  forEach((trigger) => {
    forEach((stepName) => {
      addStep(stepName, stepsMap, sortedSteps);
    })(trigger.onSuccess);

    forEach((stepName) => {
      addStep(stepName, stepsMap, sortedSteps);
    })(trigger.onFailure);
  })(formula.triggers);

  formula.steps = sortedSteps;
};

const cleanFormula = (formula) => {
  let result = omit(['accountId', 'userId', 'createdDate'])(formula);
  result.configuration = map(dissoc('id'))(formula.configuration);
  result.triggers = map(dissoc('id'))(formula.triggers);
  result.steps = map(dissoc('id'))(formula.steps);
  if (formula.subFormulas) {
    result.subFormulas = map(cleanFormula)(formula.subFormulas);
  }
  return result;
};

module.exports = async (dir, data) => {
  try {
    let formulas = await data;
    formulas = map(cleanFormula)(formulas);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    forEach(async (formula) => {
      try {
        const formulaFolder = `${dir}/${toDirectoryName(formula.name)}`;
        if (!existsSync(formulaFolder)) {
          mkdirSync(formulaFolder);
        }
        sortSteps(formula);
        formula.steps = map(
          when(
            (s) => s.type === 'filter' || s.type === 'script',
            pipe(
              tap((s) => writeFileSync(`${formulaFolder}/${toDirectoryName(s.name)}.js`, s.properties.body, 'utf8')),
              dissocPath(['properties', 'body']),
            ),
          ),
        )(formula.steps);
        writeFileSync(`${formulaFolder}/formula.json`, JSON.stringify(sortobject(formula), null, 4), 'utf8');
      } catch (error) {
        throw error;
      }
    })(formulas);
  } catch (error) {
    throw error;
  }
};
