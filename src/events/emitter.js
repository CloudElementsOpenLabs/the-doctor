const EventEmitter = require('events');

let emitter;

const singleton = () => {
  if (!emitter) {
    emitter = new EventEmitter();
  }
  return emitter;
};

const EventTopic = {
  ASSET_STATUS: 'ASSERT_STATUS',
  JOB_CREATED: 'JOB_CREATED',
  JOB_CANCELLED_SERVICE: 'JOB_CANCELLED_SERVICE',
};

module.exports = {
  emitter: singleton(),
  EventTopic,
};
