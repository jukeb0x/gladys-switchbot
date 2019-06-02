const utils = require('./SwitchbotControllerUtils.js');
const install = require('../lib/install.js');

const status = {
  install: false,
  pairing: false
};

module.exports = {
  scan: function (req, res, next) {
    install().then((result) => {
      gladys.socket.emit('switchbotDiscover', result);
    }).catch((err) => {
      gladys.socket.emit('switchbotError', err);
    }).finally(() => {
      status.install = false;
      gladys.socket.emit('switchbotStatus', utils.generateStatus(status));
    });

    status.install = true;
    res.json(utils.generateStatus(status));
  },
  setup: function (req, res, next) {
    res.json(utils.generateStatus(status));
  }
};