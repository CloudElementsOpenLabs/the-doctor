# The Doctor <sub><sup>| Cloud Elements control management tool </sup></sub>

--------------------------------------------------------------------------------

[![version](http://img.shields.io/badge/version-v1.0.1-blue.svg)](#)


## Overview
The Doctor is a CLI tool to allow easy control management with Cloud Elements. This provides the ability to move between environments and to backup files locally or to GitHub.

## How

To interact with `The Doctor` CLI run ``npm install -g ce-utils``. This will allow the control management tool to be at your finger tips. From there you can run commands like  `doctor --help` or `doctor init` to get started. What this allows you to do is add cloud elements accounts that you will be moving information between. Another way to add an account is `doctor accounts add -n devStaging -u <user secret> -o <organization secret> -b <base url for the given account for example https://staging.cloud-elements.com> ` Once an account is added to your environment you will be able to move information in or out of that account using the import, export, or delete functionality. Again there is the option of getting more help about how to use these by running commands like `doctor import --help`.


## Installation
If you don't have `node` and `npm` installed, do [that](https://docs.npmjs.com/getting-started/installing-node) first.

> __PROTIP:__ `node` version must  be >= `v6.3.0`

Install the node dependencies and initialize the doctor.

```bash
# Install all necessary npm packages:
$ npm install

# Initialize your doctor properties file:
$ doctor init
```

## doctor CLI
It is worth taking some time to familiarize yourself with the `doctor` CLI.  This CLI can import, export, and delete virtual resources, formulas, elements, or all of the above from a specified account.  Run `doctor help` and dig through some of the different sub-commands that are currently available.  

## Examples

```bash
# initialize an account
$ doctor init

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
```

## Known Limitations
* Currently, `the doctor` is a beta tool
