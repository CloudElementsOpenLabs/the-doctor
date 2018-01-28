#!/usr/bin/env node
'use strict';
require('dotenv').config({path: '/Users/calebgeene/the-doctor/config.env'});
let commander = require('commander');

commander
    .version('1.0.0')
    .command('export', 'save objects locally')
    .command('import', 'imports objects into your account')
    .command('delete', 'delete objects from your account')
    .parse(process.argv);