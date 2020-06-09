'use strict';

const get = require('../../../util/get');

module.exports = async () => {
    const vdrs = await get('vdrs', "");
    const vdrNames = Array.from(vdrs, vdr => vdr.objectName);
    return vdrNames;
};