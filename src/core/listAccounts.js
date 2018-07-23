'use strict';

const readFile = require('../util/readFile');
const path = require('path')
const homeDir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);
const {map} = require('ramda');

module.exports = async () => {
    const accounts = await readFile(filePath);
    map(account => {
        console.log(`Name: ${account.name}, UserSecret: ${account.userSecret}, OrganizationSecret: ${account.orgSecret}`);
    })(accounts);
};
