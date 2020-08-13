'use strict';

const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../constants/artifact');
const { isEmpty } = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const makePath = id => `formulas/${id}`;


module.exports = async (options) => {
    const { name, jobId, processId } = options;
    const formulas = await getFormulas(name)
    if (isEmpty(formulas)) {
        console.log(`The doctor was unable to find the formula ${name}.`)
    }
    const removePromises = await formulas.map(async formula => {
        try {
            if (isJobCancelled(jobId)) {
                removeCancelledJobId(jobId);
                throw new Error('job is cancelled');
            }
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.FORMULAS, formula.name, ArtifactStatus.INPROGRESS, '', '', false));
            await remove(makePath(formula.name));
            console.log(`Deleted Formula: ${formula.name}.`);
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.FORMULAS, formula.name, ArtifactStatus.COMPLETED, '', '', false));
        } catch (error) {
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.FORMULAS, formula.name, ArtifactStatus.FAILED, error.toString(), '', false));
            throw error;
        }
    })

    Promise.all(removePromises);
}
