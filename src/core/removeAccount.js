'use strict';

const readFile = require('../util/readFile');
const path = require('path')
const saveToFile = require('../util/saveToFile');
const homeDir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);
const {pipe, prop, append, tap, filter, propEq, not, find} = require('ramda');
const accountProps = ['name', 'userSecret', 'orgSecret'];

module.exports = async account => {
    const accounts = await readFile(filePath); 
    if (!find(propEq('name', account.name))(accounts)) {
        console.log(`Account ${account.name} not found`);
        process.exit(1);   
    }  
    pipe(
        filter(pipe(propEq('name', account.name), not)),
        saveToFile(filePath)
    )(accounts);
};