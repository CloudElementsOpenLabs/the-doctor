# The Doctor <sub><sup>| Cloud Elements Asset Management Tool </sup></sub>

--------------------------------------------------------------------------------

[![version](http://img.shields.io/badge/version-v2.0.0-blue.svg)](#)


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
Make sure the baseUrl is formatted like: `https://staging.cloud-elements.com`, `https://console.cloud-elements.com`, or `https://console.cloud-elements.co.uk`

## Usage
The doctor can download/upload assents from your Cloud Elements accounts to a directory or to a file. 
### GitHub
For use with GitHub, it is recommended to use the --directory option. This will export assets to an intuitive directory structure, and extract any JavaScript to its own file. 

### Continuous Deployment
For use with continuous deployment or just routine backups its recommended to just use the --file option. This will save space complexity as an entire CE environment can be represented as one file. 

### Commands 
```bash
download    save objects locally
upload      imports objects into your account
delete      delete objects from your account
graph       graph a formula flowchart
accounts    manage accounts to use
init        initialize account
help [cmd]  display help for [cmd]
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
`-f`, `--file` for downloading/uplaoding to/from and file   
`-n`, `--name` for downloading/uploading a specific entity to/from and directory/file   

## Examples

```bash
# list all accounts you have available to interact with
$ doctor accounts list

# removes an account from the list of accounts by the given account nickname or -n
$ doctor accounts remove -n devStaging

# add an account in one line
$ doctor accounts add -n devStaging -u <user secret> -o <organization secret> -b https://staging.cloud-elements.com

# import vdrs from a specified file path to an account (via nickname from your account list) Note: you can replace vdrs with formulas, elements, or all)
$ doctor upload vdrs staging -f ~/Desktop/vdrs-staging.json

# export vdrs from a specified account (note the account should be from your accounts list and you just need to denote the account name) to the given file path. Again: you can replace vdrs with formulas, elements, or all)
$ doctor download vdrs staging -f ~/Desktop/vdrs-staging.json

# doctor delete has similar functionality but will not allow you to delete all. Please see doctor delete --help for more
$ doctor delete formulas accountName 

# export formulas separating out JS into files for easier version control
$ doctor download formulas staging -d ~/Desktop/formulas

# import or export specific entities by their name using -n, --name
$ doctor upload formulas staging -d ~/formulas -n specific\ formula\ name
```

## Limitations

The doctor can export can not export instance or account level entities i.e. instances, instance or account level object definitions/transformations, accounts, users and formula instances. 

## Setup Local Development Environment
```bash 
$ npm uninstall ce-uti -g 
$ git clone https://github.com/cloud-elements/the-doctor.git
$ cd the-doctor
$ npm install -g
$ npm link 
```