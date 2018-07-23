'use strict';

const commander = require('commander')
const fs = require('fs');
const inquirer = require('inquirer')
const path = require('path')
const homeDir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME
const optimist = require('optimist')
  .default('user', process.env.DOCTOR_USER)
const touch = require("touch")
// constant addAccount= require('./doctor-accounts.js');

commander
  .option('-u, --userSecret <user>', 'default CE user to run churros as', '')
  .option('-o, --organization <organization>', 'password for that user', '')
  .option('-so, --stagingOrganization <stagingOrganization>', 'default CE url to run churros against', '')
  .option('-su, --stagingUser <stagingUser>', 'default CE user to run churros as', '')
  .option("-b, --orgSecret <baseUrl>", "baseUrl for the account")
  .parse(process.argv)

const validateValue = (value) => value ? true : 'Must enter a value'

const buildQuestion = (name, type, message, validate, defaultValue) => {
  return {
    name: name,
    type: type,
    message: message,
    validate: validate,
    default: defaultValue
  };
};

function addAccount(options) {
  var add = require('../core/addAccount')
  add(options)
}

const saveCreds = (answers) => {
  const folderPath = path.normalize(`${homeDir}/.doctor`)
  const filePath = path.normalize(`${homeDir}/.doctor/config.json`)
// double check this but should be the fix for a windows machine
  try {
    fs.mkdirSync(folderPath)
    touch(filePath);
    fs.writeFile(filePath, "[]", function(err) {
      if (err) {
        return console.log(err)
      }
      addAccount(answers)
    })

  } catch (err) {
    addAccount(answers)
  }
}

const questions = []
if (!optimist.argv.user) questions.push(buildQuestion('name', 'input', 'Nickname of account:', (value) => validateValue(value)))
if (!optimist.argv.password) questions.push(buildQuestion('userSecret', 'input', 'User secret:', (value) => validateValue(value)))
if (!optimist.argv.organization) questions.push(buildQuestion('orgSecret', 'input', 'Organization secret:', (value) => validateValue(value)))
if (!optimist.argv.baseUrl) questions.push(buildQuestion('baseUrl', 'input', 'Base url (format like https://staging.cloud-elements.com):', (value) => validateValue(value)))

inquirer.prompt(questions).then(answers => saveCreds(answers))
