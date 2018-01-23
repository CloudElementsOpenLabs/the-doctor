'use strict';

const {useWith, identity, filter, pipeP, __, map, converge} = require('ramda');
const getElements = require('../util/get')('elements');
const get = require('../util/get');
const saveToFile = require('../util/saveToFile');
const filterElements = element => element.private === true;
const makePath = element => `elements/${element.id}`;

const getAll = async (paths, env) => {
    let elements = map(path => {
        return get(path, env);
    }, await paths);
    return await Promise.all(elements);
}

const getFilteredElements = converge(
    getAll, [
        pipeP(
            getElements,
            filter(filterElements),
            map(makePath)
        ), identity
    ]
);

//(fileName, env)
module.exports = useWith(
    saveToFile, [
      identity, 
      getFilteredElements
    ]
)