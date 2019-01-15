'use strict';

const {pipe, pipeP, cond, prop, isNil, not, useWith, type, equals} = require('ramda');
const readFile = require('../util/readFile');
const buildElementsFromDir = require('../util/buildElementsFromDir');
const createElements = require('../util/createElements');

//(fileName)
module.exports = cond([
  [ 
    pipe(prop('file'), isNil, not),
    pipeP(
      useWith(readFile, [prop('file')]),
      cond([
        [
          pipe(type, equals('Object')) && pipe(prop('elements'), isNil, not),
          pipe(prop('elements'), createElements)
        ],
        [
          pipe(type, equals('Array')),
          createElements
        ]
      ])
    )
  ],
  [
    pipe(prop('dir'), isNil, not),
    pipeP(useWith(buildElementsFromDir, [prop('dir')]), createElements)
  ]
])