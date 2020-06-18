'use strict';
const {type} = require('ramda');
const get = require('./get');

module.exports = async (keys) => {
    let param = ""
    if (type(keys) === 'String') {
        var key = '\'' + keys.replace(/ /g, '').replace(/,/g, '\',\'') + '\'';
        param = {where: "name in (" + key + ")"};
    }
    return get('formulas',param);
}
