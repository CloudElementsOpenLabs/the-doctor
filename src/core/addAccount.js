'use strict';

const readFile = require('../util/readFile');
const saveToFile = require('../util/saveToFile');
const filePath = `${process.env.HOME}/.doctor/config.json`;
const {pipe, dropWhile, propEq, append, pick} = require('ramda');
const accountProps = ['name', 'userSecret', 'orgSecret', 'baseUrl'];

module.exports = async account => {
    const newAccount = pick(accountProps, account);
    const accounts = await readFile(filePath);
    pipe(
        dropWhile(propEq('name', account.name)),
        append(pick(accountProps, account)),
        saveToFile(filePath)
    )(accounts);
};
