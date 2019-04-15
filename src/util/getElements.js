'use strict';

const {filter, pipeP, map} = require('ramda');
const get = require('./get');
const mapP = require('./mapP');
const getElements = () => get('elements');
const filterElements = element => element.private === true;
const makePath = element => `elements/${element.id}/export`;

//()
module.exports = pipeP(
    getElements, 
    filter(filterElements),
    map(makePath),
    mapP(get)
);