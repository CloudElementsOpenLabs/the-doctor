
module.exports = (processId, type, name, status, error, metadata, isNew) => {
    return {
        processId,
        type,
        name,
        status,
        error,
        metadata,
        isNew
    }
};