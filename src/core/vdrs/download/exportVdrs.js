'use strict';

const get = require('../../../util/get');
const { emitter, EventTopic } = require('../../../events/emitter');
const constructEvent = require('../../../events/construct-event');
const { isJobCancelled } = require('../../../events/cancelled-job');


module.exports = async (vdrNames, jobId, processId) => {
    let vdrs = {};
    for (var index = 0; index < vdrNames.length; index++) {
        let vdr = null;
        try {
            if (isJobCancelled(jobId)) {
                throw new Error('job is cancelled');
            }
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'vdrs', vdrNames[index], 'inprogress', ''));
            vdr = await get(`/vdrs/${vdrNames[index]}/export`, "");
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'vdrs', vdrNames[index], 'completed', ''));
        } catch (error) {
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'vdrs', vdrNames[index], 'error', error.toString()));
            throw error;
        }
        vdrs[vdrNames[index]] = vdr;
    }
    return vdrs;
};