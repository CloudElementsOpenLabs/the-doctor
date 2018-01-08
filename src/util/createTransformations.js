const createTransformation = require('./createTransformation');
const {map, curry} = require('ramda');

const makePath = (key, objectName) => `organizations/elements/${keyOrId}/transformations/${objectName}`

module.exports = curry(async (env, transformations) => {
    pipeP(
        keys, 
        map(makePath(__, prop(__)))
    )(transformations);
});

let transformations = {
    sfdc: {
      myContact: {
  
      }
    }
  }