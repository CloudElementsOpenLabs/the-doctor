'use strict';
const {converge, pipe, pipeP, tap, prop, cond, isNil, not} = require('ramda');
const saveTo = (getData, log, save, property) =>
  converge(save, [
    pipe(prop('options'), prop(property)),
    pipeP(
      converge(getData, [
        pipe(prop('options'), prop('name')),
        pipe(prop('options'), prop('jobId')),
        pipe(prop('options'), prop('processId')),
      ]),
      tap(log),
    ),
  ]);

module.exports = (getData, log, saveToFile, saveToDir) =>
  cond([
    [pipe(prop('options'), prop('file'), isNil, not), saveTo(getData, log, saveToFile, 'file')],
    [pipe(prop('options'), prop('dir'), isNil, not), saveTo(getData, log, saveToDir, 'dir')],
  ]);
