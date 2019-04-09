
const toDirectoryName = name => name.replace(/[?>-]|(\|)|(\/)/g, ' ').replace(/[|]+/g, ' ').trim().replace(/ +/g, '-')

module.exports = {
    toDirectoryName
}