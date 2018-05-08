const fs = require('fs');
const sortobject = require('deep-sort-object');

function addStep(stepName, stepsMap, sortedSteps) {
  const step = stepsMap[stepName]
  if (!sortedSteps.includes(step)) {
    sortedSteps.push(step)
    for (let nextStepName of step.onSuccess) {
      addStep(nextStepName, stepsMap, sortedSteps)
    }
    for (let nextStepName of step.onFailure) {
      addStep(nextStepName, stepsMap, sortedSteps)
    }
  }
}

function sortSteps(formula) {
  let sortedSteps = []
  const stepsMap = formula.steps.reduce((stepsMap, step) => {stepsMap[step.name] = step;return stepsMap},{})
  for (let trigger of formula.triggers) {
    for (let stepName of trigger.onSuccess) {
      addStep(stepName, stepsMap, sortedSteps)
    }
    for (let stepName of trigger.onFailure) {
      addStep(stepName, stepsMap, sortedSteps)
    }
  }
  formula.steps = sortedSteps
}

module.exports = async (dir, data) => {
  const formulas = await data
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  for (let formula of formulas) {
    const formulaDirName = formula.name.toLowerCase().replace(/[?>-]/g, ' ').trim().replace(/ +/g, '-')
    if (!fs.existsSync(dir + '/' + formulaDirName)) {
      fs.mkdirSync(dir + '/' + formulaDirName)
    }
    delete formula.id
    delete formula.accountId
    delete formula.userId
    delete formula.createdDate
    for (let config of formula.configuration) {
      delete config.id
    }
    for (let trigger of formula.triggers) {
      delete trigger.id
    }
    sortSteps(formula)
    for (let step of formula.steps) {
      delete step.id
      if (step.type === 'filter' || step.type === 'script') {
        let fileName = step.name + '.js'
        fs.writeFileSync(dir + '/' + formulaDirName + '/' + fileName, step.properties.body, 'utf8')
        delete step.properties.body
      }
    }
    fs.writeFileSync(dir + '/' + formulaDirName + '/formula.json', JSON.stringify(sortobject(formula), null, 4), 'utf8')
  }
}