'use strict';

const { emitter, EventTopic } = require('../events/emitter');
const constructEvent = require('../events/construct-event');
const { isJobCancelled, removeCancelledJobId } = require('../events/cancelled-job');
const { Assets, ArtifactStatus } = require('../constants/artifact');
const getPrivateElements = require('../util/getPrivateElements');
const remove = require('../util/remove');
const { isEmpty } = require('ramda');
const makePath = id => `elements/${id}`;

module.exports = async (options) => {
    const { name, jobId, processId } = options;
    const elements = await getPrivateElements(name)
    if (isEmpty(elements)) {
        console.log(`The doctor was unable to find the element ${name}.`)
    }
    const removePromises = await elements.map(async element => {
        try {
            if (isJobCancelled(jobId)) {
                removeCancelledJobId(jobId);
                throw new Error('job is cancelled');
            }
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.INPROGRESS, '', '', false));
            await remove(makePath(element.id));
            console.log(`Deleted Element: ${element.key}.`);
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.COMPLETED, '', '', false));
        } catch (error) {
            emitter.emit(EventTopic.ASSET_STATUS, constructEvent(processId, Assets.ELEMENTS, element.key, ArtifactStatus.FAILED, error.toString(), '', false));
            throw error;
        }
    })

    Promise.all(removePromises);
}