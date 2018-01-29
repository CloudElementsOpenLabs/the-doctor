'use strict';
const postElement = require('./post')('elements');
const mapP = (require('./mapP'));
const get = require('./get');
const getElements = () => get('elements');

//(elementPath)
const elementExists = tryCatch(get, always(null));

// (elementsToCreate)
const createOrUpdate = useWith(
    ifElse()
)

//(data)
module.exports = pipe(
    map(makePath),
    mapP(elementEists)

)

