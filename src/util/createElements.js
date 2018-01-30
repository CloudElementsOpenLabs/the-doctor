'use strict';
const postElement = require('./post')('elements');
const {resolveP} = require('ramda-adjunct');
const {isNil, converge, map, ifElse, T, F, identity, tryCatch, pipeP, equals, prop} = require('ramda');
const mapP = (require('./mapP'));
const get = require('./get');
const createElement = require('./post')('elements');
const makePath = element => `elements/${element.key}`;
const update = require('./update');

// (element)
const updateElement = converge(update, [makePath, identity]);

//(element)
const elementExists = tryCatch(pipeP(resolveP, makePath, get, equals(prop('private'), true)), F);

// (element)
const createOrUpdate = ifElse(elementExists, updateElement, createElement)

//([element])
module.exports = console.log

