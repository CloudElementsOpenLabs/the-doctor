require('dotenv').config({path: './config.env'});
const {ap, useWith, converge, pipe, inc, identity} = require('ramda');


let object = {
    "field1": "value",
    "field2":"value"
};

object["field1"]

object.keys.forEach(item => {
    console.log(item);
});