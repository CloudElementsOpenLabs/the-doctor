const {existsSync, mkdirSync, writeFileSync} = require('fs');
const {forEach, dissoc, map, omit, pipe, tap} = require('ramda');
const sortobject = require('deep-sort-object');
const {toDirectoryName} = require('./regex');
const getResourceName = require('./getResourceName')

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
        .sort((a, b) => a.key.localeCompare(b.key))
    element.parameters = map(omit(['id', 'elementId', 'createdDate', 'updatedDate']))(element.parameters)
        .sort((a, b) => a.name.localeCompare(b.name))

    element.hooks = map(pipe(
      omit(['id', 'elementId']),
      tap(h => writeFileSync(`${elementFolder}/${h.type}Hook.js`, h.body, 'utf8')),
      dissoc('body')
    ))(element.hooks)
        .sort((a, b) => -(a.type.localeCompare(b.type)))

    if(element.resources) {
      const resourcesFolder = `${elementFolder}/resources`
      if (!existsSync(resourcesFolder)) {
        mkdirSync(resourcesFolder)
      }
      element.resources = map(resource => {
        if(resource.parameters){
          resource.parameters = map(omit(['id', 'resourceId', 'createdDate', 'updatedDate']))(resource.parameters)
              .sort((a, b) => a.name.localeCompare(b.name))
        }
        if(resource.hooks) {
          const uniqueName = getResourceName(resource)
          resource.hooks = map(pipe(
            omit(['id', 'resourceId']),
            tap(h => writeFileSync(`${resourcesFolder}/${uniqueName}${h.type}Hook.js`, h.body, 'utf8')),
            dissoc('body')
          ))(resource.hooks)
              .sort((a, b) => -(a.type.localeCompare(b.type)))
        }
        return omit(['createdDate', 'updatedDate'], resource)
      })(element.resources)
    }

    writeFileSync(`${elementFolder}/element.json`, JSON.stringify(sortobject(element), null, 4), 'utf8')

  })(elements)
}