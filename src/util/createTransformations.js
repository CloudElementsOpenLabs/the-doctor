'use strict';
const {map, find, equals, keys, propEq, reduce, append} = require('ramda');
const get = require('./get');
const create = require('./post')
const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const makePathGet = elementKey => `organizations/elements/${elementKey}/transformations`
const update = require('./update');

module.exports = async (data) => {
    const transformations = data.transformations;
    map(async elementKey => {
        let endpointTransformations = [];
        try {
            endpointTransformations = await get(makePathGet(elementKey),"");
        } catch (err) {/* ignore */}
        map(async objectName => {
            const endpointObjectName = find(equals(objectName))(keys(endpointTransformations));
            if(endpointObjectName) {
                const cleaned = cleanTransformation(transformations[elementKey][endpointObjectName], data.objectDefinitions[endpointObjectName])
                await update(makePath(elementKey, endpointObjectName), cleaned);
                console.log(`Updated Transformation: ${endpointObjectName} - ${elementKey}`)
            } else {
                const cleaned = cleanTransformation(transformations[elementKey][objectName], data.objectDefinitions[objectName])
                await create(makePath(elementKey, objectName), cleaned);
                console.log(`Created Transformation: ${objectName} - ${elementKey}`)
            }
        })(keys(transformations[elementKey]))
    })(keys(transformations));
}

const cleanTransformation = (transformation, objectDefinition) => {
    if (transformation && transformation.fields) {
        transformation.fields = reduce((fields, field) => {
            const definitionField = find(propEq("path", field.path))(objectDefinition.fields)
            if (definitionField) {
                field.type = definitionField ? definitionField.type : field.type
                return append(field, fields)
            } else {
                return fields 
            }
        })([], transformation.fields)
    }
    return transformation
}
