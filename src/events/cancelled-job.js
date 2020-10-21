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
  return idSet && idSet.has(jobId)
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
