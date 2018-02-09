'use strict';

const readFile = require('./readFile');
const propsPath = `${process.env.HOME}/.doctor/config.json`;
const {find, propEq} = require('ramda');

module.exports = async (account) => {
    const accounts = await readFile(propsPath);
    const props = find(propEq('name', account))(accounts);
    if (!props) {
        console.log(`Account ${account.name} not found`);
        process.exit(1);      
    }
    process.env.BASE_URL = props.baseUrl;
    process.env.USER_SECRET = props.userSecret;
    process.env.ORG_SECRET = props.orgSecret;
};

