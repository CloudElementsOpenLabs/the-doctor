let set;

const getIdSet = () => {
    if (!set) {
        set = new Set();
    }
    return set;
};

const addCancelledJobId = (jobId) => {
    const idSet = getIdSet();
    idSet.add(jobId);
    console.log('set', idSet);
}

const isJobCancelled = (jobId) => {
    const idSet = getIdSet();
    return idSet.has(jobId);
}

module.exports = {
    addCancelledJobId,
    isJobCancelled
};
