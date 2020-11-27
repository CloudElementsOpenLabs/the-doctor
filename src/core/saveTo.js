'use strict';
const {converge, pipe, pipeP, prop, cond, isNil, not} = require('ramda');
const saveTo = (getData, save, property) =>
  converge(save, [
    pipe(prop('options'), prop(property)),
    pipeP(
      converge(getData, [
        pipe(prop('options'), prop('name')),
        pipe(prop('options'), prop('jobId')),
        pipe(prop('options'), prop('processId')),
      ]),
    ),
  ]);

module.exports = (getData, saveToFile, saveToDir) =>
  cond([
    [pipe(prop('options'), prop('file'), isNil, not), saveTo(getData, saveToFile, 'file')],
    [pipe(prop('options'), prop('dir'), isNil, not), saveTo(getData, saveToDir, 'dir')],
  ]);
