'use strict';
const {type, curry} = require('ramda');

module.exports = curry(async (getData, objectName, jobId, processId) => {
  try {
    if (objectName !== undefined && type(objectName) !== 'Function') {
      return await getData(objectName, jobId, processId);
    } else {
      return await getData();
    }
  } catch (error) {
    throw error;
  }
});
