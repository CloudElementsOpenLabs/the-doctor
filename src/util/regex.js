
const toDirectoryName = name => name.replace(/[?>-]/g, ' ').trim().replace(/ +/g, '-')

module.exports = {
    toDirectoryName
}