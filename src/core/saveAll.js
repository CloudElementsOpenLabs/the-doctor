'use strict';
const {pipe, prop, map} = require('ramda');
const getFormulas = require('../util/getFormulas');
const getVdrs = require('./vdrs/download/getVdrs');
const getElements = require('../util/getElements');
const saveToFile = require('../util/saveToFile');
const saveToDir = require('../util/saveBackupToDir');
const saveTo = require('./saveTo');

const makeMessage = (object) => (name) => `Saved ${object}: ${name}.`;
const log = (object, propName) => map(pipe(prop(propName), makeMessage(object), console.log));

const logAll = async (data) => {
  const elements = await data.elements;
  log('Element', 'name')(elements);
  const vdrs = await data.vdrs;
  log('vdrs', 'vdrName')(vdrs);
  const formulas = await data.formulas;
  log('Formula', 'name')(formulas);
};

const getData = async () => {
  return {
    elements: await getElements(),
    formulas: await getFormulas(),
    vdrs: await getVdrs(),
  };
};

module.exports = saveTo(getData, logAll, saveToFile, saveToDir);
