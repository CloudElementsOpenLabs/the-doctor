'use strict';
const { type } = require('ramda');
const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../constants/artifact');
const get = require('./get');
const applyQuotes = require('./quoteString');


// Unlike vdrs and formulas export, formulas download is a single call and we cant split the status update to each asset
const updateFormulasStatus = (processId, formulaNames, status, error) => {
    for (const index in formulaNames) {
        emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.FORMULAS, formulaNames[index], status, error));
    }
}
module.exports = async (keys, jobId, processId) => {
    let param = ""
    if (type(keys) === 'String') {
        const formulaNames = keys.split(',');
        var escapeKey = applyQuotes(keys);
        param = { where: "name in (" + escapeKey + ")" };
        try {
            if (isJobCancelled(jobId)) {
                removeCancelledJobId(jobId);
                throw new Error('job is cancelled');
            }
            updateFormulasStatus(processId, formulaNames, ArtifactStatus.INPROGRESS, '');
            const result = await get('formulas', param);
            updateFormulasStatus(processId, formulaNames, ArtifactStatus.COMPLETED, '');

            return result;
        } catch (error) {
            updateFormulasStatus(processId, formulaNames, ArtifactStatus.FAILED, error.toString());
            throw error;
        }
    }
    return get('formulas', param);
}
