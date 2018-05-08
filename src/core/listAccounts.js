'use strict';

const readFile = require('../util/readFile');
const filePath = `${process.env.HOME}/.doctor/config.json`;
const {map} = require('ramda');

module.exports = async () => {
    const accounts = await readFile(filePath);
    map(account => {
        console.log(`Name: ${account.name}, UserSecret: ${account.userSecret}, OrganizationSecret: ${account.orgSecret}`);
    })(accounts);
};
