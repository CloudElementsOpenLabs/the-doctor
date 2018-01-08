const rp = require('request-promise');
const {curry, pipeP, map, prop} = require('ramda');


let request = curry(async (method, path) => {
    let options = {
      json: true,
      headers: {
          Authorization: 'User XoZUDmISp5lJgqA23Hnw1SDHBCxn+KxvNPRd4XmyAf0=, Organization dbfabca6c275010298c38d309fa89fea, Element RbHrMlQB8LWQyQIXrYuwY6Wu20sy+Ohr9UMukczgTbk=',
      },
      url: `https://staging.cloud-elements.com/elements/api-v2/${path}`,
      method: method
    };
    try {
      return (await rp(options));
    } catch (err) {
      console.log(err);
    }
  });
let get = request("GET");
let remove = request("DELETE");

const makePath = (id) => `vendors/${id}`;

let deleteInstances = pipeP(
    get,
    map(prop('id')),
    map(makePath),
    map(remove)
);

deleteInstances('vendors');

