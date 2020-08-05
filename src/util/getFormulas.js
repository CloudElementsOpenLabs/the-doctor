'use strict';
const {type} = require('ramda');
const get = require('./get');
const applyQuotes = require('./quoteString');

module.exports = async (keys, service) => {
    let param = ""
    if (type(keys) === 'String') {
        const formulaNames = keys.split(',');
        var escapeKey = applyQuotes(keys);
        param = { where: "name in (" + escapeKey + ")" };
        try {
            if (service) {
                const cancelled = await service.isJobCancelled(service.jobId);
                if (cancelled) {
                    throw new Error('job is cancelled');
                }
                for (const index in formulaNames) {
                    await service.updateProcessArtifact(service.processId, 'formulas', formulaNames[index], 'inprogress', '');
                }

            }
            const result = await get('formulas', param);

            if (service) {
                for (const index in formulaNames) {
                    await service.updateProcessArtifact(service.processId, 'formulas', formulaNames[index], 'completed', '');
                }

            }
            return result;
        } catch (error) {
            if (service) {
                for (const index in formulaNames) {
                    await service.updateProcessArtifact(service.processId, 'formulas', formulaNames[index], 'error', error.toString());
                }
            }
            throw error;
        }
    }
    return get('formulas',param);
}
