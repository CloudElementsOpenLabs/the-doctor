'use strict';
const { map, find, propEq, findIndex } = require('ramda');
const getElements = require('./getElements');
const get = require('./get');
const createElement = require('./post')('elements');
const post = require('./post');
const makePath = element => `elements/${element.key}`;
const update = require('./update');
const min = arr => arr.map(x => { return { methodPath: x.path + x.method } });


module.exports = async (elements, service) => {
    const endpointElements = await getElements();
    map(async element => {
        try {
            if (service) {
                const jobCancelled = await service.isJobCancelled(service.jobId);
                if (jobCancelled) {
                    throw new Error('job is cancelled');
                }
                await service.updateProcessArtifact(service.processId,'elements',element.key,'inprogress','');
            }
            let endpointElement = find(propEq('key', element.key))(endpointElements);
            if (endpointElement) {
                if (element.private === true || element.actuallyExtended === false) {
                    await update(makePath(endpointElement), element);
                    console.log(`Updated Element: ${endpointElement.key}`);
                } else {
                    //extend the element
                    // TODO
                    // GET resources from destination to compare
                    const resources = await get(`elements/${element.key}/resources`, "");
                    const destinationResources = resources.filter(resource => resource.ownerAccountId !== 1);

                    //combination of path + method is uniquq per element per account
                    const compDestination = min(destinationResources)
                    const compOrigin = min(element.resources);

                    let toUpload = { create: [], update: [] };
                    // 2, Compare GET/resources to the resources in the saved element
                    for (let i = 0; i < compOrigin.length; i++) {

                        const exists = findIndex(propEq('methodPath', compOrigin[i].methodPath))(compDestination);
                        console.log(`Element Exteneded: ${element.key}`);
                        if (exists > -1) {
                            // 3. If resource already exist - PUT
                            console.log('destinationResources[exists].id', destinationResources[exists].id);
                            toUpload.update.push(update(`elements/${element.key}/resources/${destinationResources[exists].id}`, element.resources[i]));
                            console.log(`    Resource Updated:\n        Method: ${element.resources[i].method}\n        Path: ${element.resources[i].path}`);
                        } else {
                            // 4. If resource doesn't exist - POST        
                            toUpload.create.push(post(`elements/${element.key}/resources`, element.resources[i]));
                            console.log(`    Resource Created:\n        Method: ${element.resources[i].method}\n        Path: ${element.resources[i].path}`);
                        }
                    }

                    //combine arrays of promises
                    let arrs = toUpload.create.concat(toUpload.update);
                    await Promise.all(arrs);
                }
            } else {
                if (element.private === true || element.actuallyExtended === false) {
                    //create non-extended element
                    await createElement(element);
                    console.log(`Created Element: ${element.key}`);
                } else {
                    let toUpload = { create: [], update: [] };
                    for (let i = 0; i < element.resources.length; i++) {

                        toUpload.create.push(post(`elements/${element.key}/resources`, element.resources[i]));
                        console.log(`    Resource Created:\n        Method: ${element.resources[i].method}\n        Path: ${element.resources[i].path}`);
                    }
                    //combine arrays of promises
                    let arrs = toUpload.create.concat(toUpload.update);
                    await Promise.all(arrs);
                }
            }
            if (service) {
                await service.updateProcessArtifact(service.processId,'elements',element.key,'completed','');
            }
        }catch (error) {
            if (service) {
                await service.updateProcessArtifact(service.processId,'elements',element.key,'error',error.toString());
            }
            throw error;
        }

    })(elements);
}

