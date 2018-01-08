#!/usr/bin/env node
'use strict';

let doctor = require('commander');

doctor
    .version('1.0.0')
    .command('save [object]', 'Save an entity locally. Valid values: objectDefinitions, transformations, formulas')
    .parse(process.argv);