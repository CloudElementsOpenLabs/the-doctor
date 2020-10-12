const {addCancelledJobId} = require('./cancelled-job');
const {emitter, EventTopic} = require('./emitter');

// Doctor core listen for the events emitted from the doctor service and holds it in the global set.
// Doctor checks whether the job is cancelled by checkig if that job id present in the global set
const jobCancelledHandler = (args) => {
  console.log(`${EventTopic.JOB_CANCELLED_SERVICE} event received from the doctor-service for job id: ${args.jobId}`)
  addCancelledJobId(args.jobId);
};

let listenerLoaded;
const addListener = () => {
  if (!listenerLoaded) {
    emitter.on(EventTopic.JOB_CANCELLED_SERVICE, jobCancelledHandler);
    listenerLoaded = true;
  }
};

module.exports = {
  addListener,
};
