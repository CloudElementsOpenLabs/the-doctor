'use strict';

const {type, filter, curry, toLower} = require('ramda');

// const filterData = curry((name, object) => object.name === name)

//(fileName)
module.exports = curry(async (getData, objectName, id) => {
    if(objectName !== undefined && type(objectName) !== 'Function') {
        const data = await getData()
        return data;
    } else if(id){
        return await getData(id)
    }else {
        return await getData()
    }
})