const {existsSync, mkdirSync, writeFileSync} = require('fs');
const {forEach, dissoc, map, omit, pipe, tap} = require('ramda');
const sortobject = require('deep-sort-object');
const {toDirectoryName} = require('./regex');

module.exports = async (dir, data) => {
  const elements = await data
  if (!existsSync(dir)) {
    mkdirSync(dir)
  }
  forEach(element => {
    const elementFolder = `${dir}/${toDirectoryName(element.name)}`
    if (!existsSync(elementFolder)) {
      mkdirSync(elementFolder)
    }
    delete element.id
    element.configuration = map(dissoc('id'))(element.configuration)
    element.parameters = map(omit(['id', 'elementId', 'createdDate', 'updatedDate']))(element.parameters)

    element.hooks = map(pipe(
      omit(['id', 'elementId']),
      tap(h => writeFileSync(`${elementFolder}/${h.type}Hook.js`, h.body, 'utf8')),
      dissoc('body')
    ))(element.hooks)

    if(element.resources) {
      const resourcesFolder = `${elementFolder}/resources`
      if (!existsSync(resourcesFolder)) {
        mkdirSync(resourcesFolder)
      }
      element.resources = map(resource => {
        if(resource.parameters){
          resource.parameters = map(omit(['id', 'resourceId', 'createdDate', 'updatedDate']))(resource.parameters)
        }
        if(resource.hooks) {
          resource.hooks = map(pipe(
            omit(['id', 'resourceId']),
            tap(h => writeFileSync(`${resourcesFolder}/${resource.id}${h.type}Hook.js`, h.body, 'utf8')),
            dissoc('body')
          ))(resource.hooks)
        }
        return omit(['createdDate', 'updatedDate'], resource)
      })(element.resources)
    }

    writeFileSync(`${elementFolder}/element.json`, JSON.stringify(sortobject(element), null, 4), 'utf8')

  })(elements)
}