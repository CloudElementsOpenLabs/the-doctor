'use strict';
module.exports = (keys) => {
  //replace comma separated keys with quotes ex: square, intacct will be transformed to '\'square\',\'intacct\''
  return '\'' + keys.replace(/,/g, '\',\'') + '\'';
}
