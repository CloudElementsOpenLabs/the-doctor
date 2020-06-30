'use strict';
const {type} = require('ramda');
const get = require('./get');
const applyQuotes = require('./quoteString');

module.exports = async (keys) => {
    let param = ""
    if (type(keys) === 'String') {
        var key = applyQuotes(keys);
        param = {where: "name in (" + key + ")"};
    }
    return get('formulas',param);
}
