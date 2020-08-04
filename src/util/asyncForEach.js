'use strict';

module.exports = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index]);
    }    
} 