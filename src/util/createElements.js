'use strict';
const {map, find, and, propEq, pipeP, filter} = require('ramda');
const get = require('./get');
const createElement = require('./post')('elements');
const makePath = element => `elements/${element.key}`;
const update = require('./update');

module.exports = async (elements) => {
    let endpointElements = await pipeP(get, filter(propEq('private', true)))('elements');
    map(async element => {
        let endpointElement = find(propEq('key', element.key))(endpointElements);
        if (endpointElement) {
            await update(makePath(endpointElement), element);
        } else {
            await createElement(element);
        }
    })(elements);
}

