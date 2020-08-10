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
    JOB_CANCELLED: 'JOB_CANCELLED'
}


module.exports = {
    emitter: singleton(),
    EventTopic
};
