'use strict';

const {map, curry, pipeP, useWith, identity} = require('ramda');

const makePath = curry((key, objectName) => `organizations/elements/${keyOrId}/transformations/${objectName}`);

// const create = pipeP(
//     makePath
// )

// //(objectName, transformations)
// const createAllForElement = useWith(
//     makePath, [
//         identity,
//         Object.keys
//     ]
// )

// module.exports = pipeP(
//     Object.keys,
//     map(makePath)
// )

// converge(
//     makePath, [
//         Object.keys,
//         pipe(
//             Object.keys,
//             map(Object.keys)
//         )
//     ]
// )




//     {
//     sfdc: {
//       myContact: {
  
//       }
//     }
//   }