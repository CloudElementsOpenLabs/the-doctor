'use strict';

const production = 'production';

module.exports = (env) => {
  return env === production ? `User ${process.env.USER_SECRET_PROD}, Organization ${process.env.ORG_SECRET_PROD}` :
    `User ${process.env.USER_SECRET_STAGING}, Organization ${process.env.ORG_SECRET_STAGING}`;
};