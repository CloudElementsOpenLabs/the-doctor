const { addCancelledJobId } = require('./cancelled-job');
const { emitter, EventTopic } = require('./emitter');


const jobCancelledListener = (jobId) => {
    addCancelledJobId(jobId);
}

let listenerLoaded;
const addListener = () => {
    if (!listenerLoaded) {
        emitter.on(EventTopic.JOB_CANCELLED, jobCancelledListener);
        listenerLoaded = true;
    }
};


module.exports = {
    addListener
};
