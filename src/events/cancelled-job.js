require('log-prefix')(() => `[${new Date().toISOString()}] Doctor-core: %s`);
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
  if (!jobId) {
    return;
  }
  const idSet = getIdSet();
  console.log('isJobCancelled - Content of the Cancelled Job Id Queue', idSet);
  if (idSet.has(jobId)) {
    return idSet.has(jobId);
  } else {
    // Job cancelled event is consumed by the doctor service through event listener
    // emitter.emit(EventTopic.JOB_CANCELLED_CORE, {jobId});
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
