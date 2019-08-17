module.exports = resource => {
    const resourceName = `${resource.method}-${resource.path}`
    const cleanName =
        resourceName
            .replace(/\/hubs\/[^/]*\//, '')
            .replace(/\//g, '-')
            .replace(/[{}]/g, '')
    return `${cleanName}-`
}