'use strict';

const { isEmpty, isNil } = require('ramda');


module.exports = () => {
    if (isNil(process.env.AUTHENTICATION) || isEmpty(process.env.AUTHENTICATION)) {
        return `User ${process.env.USER_SECRET}, Organization ${process.env.ORG_SECRET}`;
    }
    return process.env.AUTHENTICATION;
}