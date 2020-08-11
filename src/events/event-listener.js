const { addCancelledJobId } = require('./cancelled-job');
const { emitter, EventTopic } = require('./emitter');


// Doctor core listen for the events emitted from the doctor service and holds it in the global set.
// Doctor checks whether the job is cancelled by checkig if that job id present in the global set
const jobCancelledHandler = (jobId) => {
    addCancelledJobId(jobId);
}

let listenerLoaded;
const addListener = () => {
    if (!listenerLoaded) {
        emitter.on(EventTopic.JOB_CANCELLED, jobCancelledHandler);
        listenerLoaded = true;
    }
};


module.exports = {
    addListener
};
