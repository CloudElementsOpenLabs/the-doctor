# The Doctor <sub><sup>| Cloud Elements control management tool </sup></sub>

--------------------------------------------------------------------------------

[![version](http://img.shields.io/badge/version-v1.0.1-blue.svg)](#)


## Overview
The Doctor is a CLI tool to allow easy control management with Cloud Elements. This provides the ability to move between environments and to backup files locally or to GitHub.

## Installation

```bash
$ npm install -g ce-util
```
> __PROTIP:__ `node` version must  be >= `v6.3.0`

# Setup
```bash
$ doctor init
```
The init function will create a hidden directory `.doctor` in your home directory. This folder will have a `config.json` that will store all your accounts. 

An account consists of a `name`, `orgSecret`, `userSecret` and `baseUrl`. 
Make sure the baseUrl is formatted like: `https://staging.cloud-elements.com` or `https://api.cloud-elements.com`

## Examples

```bash
# list all accounts you have available to interact with
$ doctor accounts list

# removes an account from the list of accounts by the given account nickname or -n
$ doctor accounts remove -n devStaging

# Run the entire suite for the closeio element
$ doctor accounts add -n devStaging -u <user secret> -o <organization secret> -b https://staging.cloud-elements.com

# import commonResources from a specified file path to an account (via nickname from your account list) Note: you can replace commonResources with formulas, elements, or all)
$ doctor import commonResources staging -f ~/Desktop/objectDefinitions-staging.json

# export commonResources from a specified account (note the account should be from your accounts list and you just need to denote the account name) to the given file path. Again: you can replace commonResources with formulas, elements, or all)
$ doctor export commonResources staging -f ~/Desktop/commonResources-staging.json

# doctor delete has similar functionality but will not allow you to delete all. Please see doctor delete --help for more
$ doctor delete formulas accountName 
```

## Limitations

The doctor cannot export instance level entities i.e. instances, instance level object definitions/transformations, and formula instances. This is because there is no easy way to move oauth2 
