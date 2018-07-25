'use strict';

const readFile = require('../util/readFile');
const path = require('path')
const homeDir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);
const cTable = require('console.table')

module.exports = async () => {
    const accounts = await readFile(filePath);
    console.table(accounts)
};
