
module.exports = (processId, type, name, status, error, metadata = '') => {
    return {
        processId,
        type,
        name,
        status,
        error,
        metadata
    }
};