const {existsSync, mkdirSync, writeFileSync} = require('fs');
const {forEach, dissoc, map, omit, pipe, tap, gt, propOr, pluck, countBy, identity, isNil, isEmpty} = require('ramda');
const sortobject = require('deep-sort-object');
const {toDirectoryName} = require('./regex');
const getResourceName = require('./getResourceName');
const isNilOrEmpty = (val) => isNil(val) || isEmpty(val);

module.exports = async (dir, data) => {
  const elements = await data;
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  // Construct the hash map with key as element key and value as number of occurences
  // in the given elements object above. eg: {sfdc: 2, zoho: 1}
  // This is required to structure elements folder properly incase if a element with
  // element key appear twice (1 extended and 1 private element) and to differentiate
  // private and extended element folder structure
  const allElementsNameCount = pipe(pluck('name'), countBy(identity))(elements);
  forEach((element) => {
    const elementFolder =
      gt(Number(propOr(1, element.name)(allElementsNameCount)), 1) &&
      (isNilOrEmpty(element.private) ? element.extended : !element.private)
        ? `${dir}/${toDirectoryName(element.name)}_extended`
        : `${dir}/${toDirectoryName(element.name)}`;

    if (!existsSync(elementFolder)) {
      mkdirSync(elementFolder);
    }

    element = dissoc('id', element);
    element.configuration = map(dissoc('id'))(element.configuration).sort((a, b) => a.key.localeCompare(b.key));
    element.parameters = map(omit(['id', 'elementId', 'createdDate', 'updatedDate']))(element.parameters).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    element.hooks = map(
      pipe(
        omit(['id', 'elementId']),
        tap((h) => writeFileSync(`${elementFolder}/${h.type}Hook.js`, h.body, 'utf8')),
        dissoc('body'),
      ),
    )(element.hooks).sort((a, b) => -a.type.localeCompare(b.type));

    if (element.resources) {
      const resourcesFolder = `${elementFolder}/resources`;
      if (!existsSync(resourcesFolder)) {
        mkdirSync(resourcesFolder);
      }
      element.resources = map((resource) => {
        if (resource.parameters) {
          resource.parameters = map(omit(['id', 'resourceId', 'createdDate', 'updatedDate']))(
            resource.parameters,
          ).sort((a, b) => a.name.localeCompare(b.name));
        }
        if (resource.hooks) {
          const uniqueName = getResourceName(resource);
          resource.hooks = map(
            pipe(
              omit(['id', 'resourceId']),
              tap((h) => writeFileSync(`${resourcesFolder}/${uniqueName}${h.type}Hook.js`, h.body, 'utf8')),
              dissoc('body'),
            ),
          )(resource.hooks).sort((a, b) => -a.type.localeCompare(b.type));
        }
        return omit(['createdDate', 'updatedDate'], resource);
      })(element.resources).sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
    }

    writeFileSync(`${elementFolder}/element.json`, JSON.stringify(sortobject(element), null, 4), 'utf8');
  })(elements);
};
