'use strict';
const { type } = require('ramda');
const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled } = require('../events/cancelled-job');
const get = require('./get');
const applyQuotes = require('./quoteString');

const updateFormulasStatus = (processId, formulaNames, status, error) => {
    for (const index in formulaNames) {
        emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, 'formulas', formulaNames[index], status, error));
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
                throw new Error('job is cancelled');
            }
            updateFormulasStatus(processId, formulaNames, 'inprogress', '');
            const result = await get('formulas', param);
            updateFormulasStatus(processId, formulaNames, 'completed', '');

            return result;
        } catch (error) {
            updateFormulasStatus(processId, formulaNames, 'error', error.toString());
            throw error;
        }
    }
    return get('formulas', param);
}
