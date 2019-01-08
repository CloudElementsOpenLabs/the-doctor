'use strict';

const {type, filter, curry, toLower} = require('ramda');

const filterData = curry((name, object) => toLower(object.name) === toLower(name))

//(fileName)
module.exports = curry(async (getData, objectName) => {
    if(objectName !== undefined && type(objectName) !== 'Function') {
        const data = await getData()
        return filter(filterData(objectName), data)
    } else {
        return await getData()
    }
})