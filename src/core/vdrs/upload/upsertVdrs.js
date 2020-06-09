'use strict';
const update = require('../../../util/update');

module.exports = async (vdrs) => {
    for (var vdrName in vdrs) {
        console.log('upserting vdr', vdrName);
        await update('vdrs/import', vdrs[vdrName]);
    }
}

