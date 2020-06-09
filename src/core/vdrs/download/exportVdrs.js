'use strict';

const get = require('../../../util/get');


module.exports = async (vdrNames) => {
    let vdrs = {};
    for (var index = 0; index < vdrNames.length; index++) {
        const vdr = await get(`/vdrs/${vdrNames[index]}/export`, "");
        vdrs[vdrNames[index]] = vdr;
    }
    return vdrs;
};