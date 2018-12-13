#!/usr/bin/env node
'use strict'

let commander = require('commander')
const { version } = require('../../package.json')

commander
    .version(version)
    .command('export', 'save objects locally')
    .command('download', 'save objects locally')
    .command('import', 'imports objects into your account')
    .command('upload', 'imports objects into your account')
    .command('delete', 'delete objects from your account')
    .command('accounts', 'manage accounts to use')
    .command('init', 'initialize account')
    .parse(process.argv)
