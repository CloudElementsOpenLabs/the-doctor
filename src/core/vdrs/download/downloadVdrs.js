'use strict';

const {type, pipe, prop,__ } = require('ramda')
const getVdrNames = require('./getVdrNames')
const exportVdrs = require('./exportVdrs')

const getData = async (vdrName) => {
  let vdrNames = [];
  if (type(vdrName) === 'String') {
    vdrNames = vdrName.split(',');
  } else {
    vdrNames = await getVdrNames();
  }

  const exportData = await exportVdrs(vdrNames);
  console.log(exportData)
  return exportData;
}

//(parms)
module.exports = params => {
  if (params.options.hasOwnProperty('version')) {
    params.options.name = params.options.name + '_' + params.options.version
  }
    return pipeP(getData(pipe(prop('options'), prop('name'))), applyVersion(__, params));
}
