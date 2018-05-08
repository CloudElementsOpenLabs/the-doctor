const saveToFile = require('../util/saveToFile');
const saveFormulasToDir = require('../util/saveFormulasToDir')

module.exports = (parms, data) => {
  const options = parms.options
  if (options.file) {
    saveToFile(options.file, data)
  }
  if (options.dir) {
    if (parms.object === 'formulas') {
      saveFormulasToDir(options.dir,  data)
    }
    else {
      console.log("--dir option only supported for formulas at the current time")
      process.exit(1);
    }
  }
}