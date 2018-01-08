require('dotenv').config({path: './config.env'});
const {pipe, apply, curry, invoker, keys, __, map, prop, identity, repeat, toPairs} = require('ramda');

let transformations = {
  sfdc: {
    myContact: {
      hello: "world"
    }, 
    one: {
      field: "name"
    }
  },
  quickbooks: {
    yourContact: {
      foo: "bar"
    }
  }
};


const makePath = curry((key, objectName) => `organizations/elements/${key}/transformations/${objectName}`);

const createTransformations = (env, body) => {
  return paths = pipe(
    keys, 
    map(prop(__, body)),
    map(keys), 
  )(body)
};


console.log(createTransformations('staging' , transformations));

