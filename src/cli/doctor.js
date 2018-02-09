#!/usr/bin/env node
'use strict';
require('dotenv').config({path: '/Users/calebgeene/the-doctor-dev/config.env'});
let commander = require('commander');

commander
    .version('1.0.0')
    .command('export', 'save objects locally')
    .command('import', 'imports objects into your account')
    .command('delete', 'delete objects from your account')
    .command('accounts', 'manage accounts to use')
    .parse(process.argv);