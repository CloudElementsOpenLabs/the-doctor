'use strict';

const { existsSync } = require('fs')
const readFile = require('../util/readFile')
const { dirname } = require('path')
const graphFormula = require('../util/generateFormulaFlowchart')

const readFormula = async formulaFile => {
  if(!existsSync(formulaFile)){
    console.log(`Formula file does not exist: ${formulaFile}`)
    return
  }
  return  await readFile(formulaFile)
}
//(fileName)
module.exports = async parms => {
  if(parms.file) {
    const formula = await readFormula(parms.file)
    const formulaDirName = dirname(parms.file)

    if(formula instanceof Array){
      console.log('Error: graph function expects file content to be only one formula.')
      return
    }
    await graphFormula(formula, formulaDirName)
  }
}