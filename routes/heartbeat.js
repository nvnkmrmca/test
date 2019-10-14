'use strict';

var _heartbeat = require('../controller/heartbeat');

module.exports = (app) => {
    app.route('/heartbeat').get(_heartbeat.get);
};
