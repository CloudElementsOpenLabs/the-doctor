'use strict';

const readFile = require('./readFile');
const homeDir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
const path = require('path')
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);
const {find, propEq} = require('ramda');

module.exports = async (account) => {
    if (typeof(account) === 'object') {
        process.env.AUTHENTICATION = account.authorization;
        process.env.BASE_URL = account.baseUrl;
    } else {
        const accounts = await readFile(filePath);
        const props = find(propEq('name', account))(accounts);
        if (!props) {
            console.log(`No account found`);
            process.exit(1);
        }
        process.env.BASE_URL = props.baseUrl;
        process.env.USER_SECRET = props.userSecret;
        process.env.ORG_SECRET = props.orgSecret;
    }
};

