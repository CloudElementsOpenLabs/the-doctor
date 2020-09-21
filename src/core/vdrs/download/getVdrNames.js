'use strict';
const get = require('../../../util/get');
const {isNil, isEmpty} = require('ramda');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

module.exports = async (params = '') => {
  try {
    const vdrs = await get('vdrs', params);
    return isNilOrEmpty(vdrs) ? [] : Array.from(vdrs, vdr => vdr.objectName);
  } catch (error) {
    throw error;
  }
};