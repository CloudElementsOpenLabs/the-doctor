# The Doctor <sub><sup>| Cloud Elements Asset Management Tool </sup></sub>

  

--------------------------------------------------------------------------------

  

[![Version](http://img.shields.io/npm/v/ce-util.svg)]()

[![Downloads](https://img.shields.io/npm/dt/ce-util.svg)]()

  

## Overview

The Doctor is a CLI tool to allow easy control management with Cloud Elements. This provides the ability to move between environments and to backup files locally or to GitHub.

  

## Installation

  

```bash

$ npm install -g ce-util

```

>  __PROTIP:__  `node` version must be >= `v6.3.0`

  

# Setup

```bash

$ doctor init

```

The init function will create a hidden directory `.doctor` in your home directory. This folder will have a `config.json` that will store all your accounts.

  

An account consists of a `name`, `orgSecret`, `userSecret` and `baseUrl`.

Make sure the baseUrl is formatted like: `https://staging.cloud-elements.com`, `https://console.cloud-elements.com`, or `https://console.cloud-elements.co.uk`

  

## Usage

The doctor can download/upload assents from your Cloud Elements accounts to a directory or to a file.

### GitHub

For use with GitHub, it is recommended to use the --directory option. This will export assets to an intuitive directory structure, and extract any JavaScript to its own file.

### Versioning

Versioning in the doctor can be used to manage VDRs or Formulas in github using the -v flag. It allows deploying an updated versioned object to an environment without affecting the current deployed version. For upload the version is applied by appending "\_{version}" to the name of the object being uploaded. For downloads the version will split on a "_" delimiter. Example download result "myFormulaName_v2" saves as "myFormulaName". Versioning currently only supports downloading of single objects using the `-n`

  

### Continuous Deployment

For use with continuous deployment or just routine backups its recommended to just use the --file option. This will save space complexity as an entire CE environment can be represented as one file.

  

### Commands

```bash

download save objects locally

upload imports objects into your account

delete delete objects from your account

graph graph a formula flowchart

accounts manage accounts to use

init initialize account

help [cmd] display help  for [cmd]

```

  

### Objects

`all`

`elements`

`formulas`

`vdrs`

`formulasInstances` (delete only)

`instances` (delete only)

  

### Options

`-d`, `--directory` for downloading/uploading to/from and directory

`-f`, `--file` for downloading/uploading to/from and file

`-n`, `--name` for downloading/uploading a specific entity to/from and directory/file

`-v`, `--version` for downloading/uploading versioned objects

`-l`, `--level` for downloading vdrs from a specified level

`-a`, `--accountId` for downloading the account level vdrs

`-i`, `--instanceId` for downloading the instance level vdrs
  

## Examples

  

```bash

# list all accounts you have available to interact with

$ doctor accounts list

  

# removes an account from the list of accounts by the given account nickname or -n

$ doctor accounts remove -n devStaging

  

# add an account in one line

$ doctor accounts add -n devStaging -u <user secret> -o <organization secret> -b https://staging.cloud-elements.com

  

# import vdrs from a specified file path to an account (via nickname from your account list) (Note: you can replace vdrs with formulas, elements, or all)

$ doctor upload vdrs staging -f ~/Desktop/vdrs-staging.json

  

# export vdrs from a specified account (note the account should be from your accounts list and you just need to denote the account name) to the given file path. Again: you can replace vdrs with formulas, elements, or all)

$ doctor download vdrs staging -f ~/Desktop/vdrs-staging.json

  

# export vdrs from all the levels (organization, account, instance)

$ doctor download vdrs staging -d ~/Desktop/vdrs-staging -n vdrName -a 111 -i 222

  

# export vdrs from an account by specifying account id. (Note: You can replace accounts with instances and -a with -i to obtain instance level vdrs only)

$ doctor download vdrs staging -f ~/Desktop/vdrs-staging.json -n vdrName -l accounts -a 111

  

# doctor delete has similar functionality but will not allow you to delete all. Please see doctor delete --help for more

$ doctor delete formulas accountName

  

# export formulas separating out JS into files for easier version control

$ doctor download formulas staging -d ~/Desktop/formulas

  

# import or export specific entities by their name using -n, --name

$ doctor upload formulas staging -d ~/formulas -n specific\ formula\ name

  

# export a versioned object (example formula named myFormula_2)

$ doctor download formulas staging -f ~/formula.json -n myFormula -v 2

  

# import a versioned object (example formula named myFormula, version 3)

$ doctor upload formulas staging -f ~/formula.json -v 3

```

  

## Limitations

  

The doctor can not export accounts, users and formula instances.

  

Versioning is not supported for elements

  

## Setup Local Development Environment

```bash

$ npm uninstall ce-util -g

$ git clone https://github.com/CloudElementsOpenLabs/the-doctor.git

$ cd the-doctor

$ npm install -g

$ npm link

```