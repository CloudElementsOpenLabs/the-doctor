const {curry, apply} = require('ramda');

module.exports = curry((f, params) => {
    try {
        return [null, apply(f, params)];
    } catch (err) {
        return [err, null];
    }
});