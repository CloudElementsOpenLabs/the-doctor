'use strict';

const production = 'production';

module.exports = () => `User ${process.env.USER_SECRET}, Organization ${process.env.ORG_SECRET}`;