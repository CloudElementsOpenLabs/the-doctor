
const toDirectoryName = name => name.toLowerCase().replace(/[?>-]/g, ' ').trim().replace(/ +/g, '-')

module.exports = {
    toDirectoryName
}