
module.exports = (processId, type, name, status, error) => {
    return {
        processId,
        type,
        name,
        status,
        error
    }
};