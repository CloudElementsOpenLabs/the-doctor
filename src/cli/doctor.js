#!/usr/bin/env node
'use strict';
require('dotenv').config({path: '/Users/calebgeene/the-doctor/config.env'});
let commander = require('commander');

commander
    .version('1.0.0')
    .command('save', 'save objects locally')
    .command('migrate', 'migrate object from one environment to another')
    .command('delete', 'delete objects from your account')
    .parse(process.argv);