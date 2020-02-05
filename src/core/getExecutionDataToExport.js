'use strict';

const { curry } = require('ramda');

//(fileName)
 module.exports = curry((getData) => {
        return async function myfunct(id){
            return await getData(id);
        };
    })

// module.exports =  (getData, id) => {
//     console.log("getData: ", getData)
//     console.log("id: ", id)
//     return  getData(id);
// }