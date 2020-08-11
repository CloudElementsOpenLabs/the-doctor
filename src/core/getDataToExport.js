'use strict';

const {type, filter, curry, toLower} = require('ramda');

const filterData = curry((name, object) => toLower(object.name) === toLower(name))

//(fileName)
module.exports = curry(async (getData, objectName, jobId, processId) => {
    if(objectName !== undefined && type(objectName) !== 'Function') {
        return await getData(objectName, jobId, processId);
    } else {
        return await getData()
    }
})
