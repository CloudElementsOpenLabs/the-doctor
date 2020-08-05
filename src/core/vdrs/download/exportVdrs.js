'use strict';

const get = require('../../../util/get');


module.exports = async (vdrNames, service) => {
    let vdrs = {};
    for (var index = 0; index < vdrNames.length; index++) {
        let vdr = null;
        try {
            if (service) {
                const cancelled = await service.isJobCancelled(service.jobId);
                if (cancelled) {
                    throw new Error('job is cancelled');
                }
                await service.updateProcessArtifact(service.processId, 'vdrs', vdrNames[index], 'inprogress', '');
            }
            vdr = await get(`/vdrs/${vdrNames[index]}/export`, "");

            if (service) {
                await service.updateProcessArtifact(service.processId, 'vdrs', vdrNames[index], 'completed', '');
            }
        } catch (error) {
            if (service) {
                await service.updateProcessArtifact(service.processId, 'vdrs', vdrNames[index], 'error', error.toString());
            }
            throw error;
        }
        vdrs[vdrNames[index]] = vdr;
    }
    return vdrs;
};