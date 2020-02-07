'use strict';

const {converge, pipe, pipeP, tap, prop, cond, isNil, not, pathOr} = require('ramda');

const saveTo = (getData, log, save, property) => converge(
  save, [
    pipe(prop('options'), prop(property)),
    pipeP(
      data => 
        getData(
          pathOr(null, ['options', 'name'], data),
          pathOr(null, ['options', 'level'], data),
          pathOr(null, ['options', 'account'], data),
          pathOr(null, ['options', 'instance'], data),
        ),
      tap(log)
    )
  ])

//(parms)
module.exports = (getData, log, saveToFile, saveToDir) => 
    cond([
        [ 
            pipe(prop('options'), prop('file'), isNil, not),
            saveTo(getData, log, saveToFile, 'file')
        ],
        [
            pipe(prop('options'), prop('dir'), isNil, not),
            saveTo(getData, log, saveToDir, 'dir')
        ]
    ])