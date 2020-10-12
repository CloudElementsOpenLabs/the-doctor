const {emitter, EventTopic} = require('./emitter');
let set;

const getIdSet = () => {
  if (!set) set = new Set();
  return set;
};

const addCancelledJobId = (jobId) => {
  const idSet = getIdSet();
  !idSet.has(jobId) && idSet.add(jobId);
  console.log('addCancelledJobId - Content of the Cancelled Job Id Queue', idSet);
};

const isJobCancelled = (jobId) => {
  const idSet = getIdSet();
  console.log('isJobCancelled - Content of the Cancelled Job Id Queue', idSet);
  if (idSet.has(jobId)) {
    return idSet.has(jobId);
  } else {
    // Job cancelled event is consumed by the doctor service through event listener
    emitter.emit(EventTopic.JOB_CANCELLED_SERVICE, {jobId});
  }
};

const removeCancelledJobId = (jobId) => {
  const idSet = getIdSet();
  idSet.delete(jobId);
  console.log('removeCancelledJobId - Content of the Cancelled Job Id Queue', idSet);
};

module.exports = {
  addCancelledJobId,
  isJobCancelled,
  removeCancelledJobId,
};
