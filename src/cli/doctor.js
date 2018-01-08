#!/usr/bin/env node
'use strict';

let commander = require('commander');

commander
    .version('1.0.0')
    .command('save', 'save objects locally')
    .command('migrate', 'migrate object from one environment to another')
    .parse(process.argv);