const noble = require('noble');
const shared = require('./lib/shared.js');
const exec = require('./lib/exec.js');
const SwitchbotController = require('./controller/SwitchbotController.js');
const SwitchbotControllerUtils = require('./controller/SwitchbotControllerUtils.js');

module.exports = function (sails) {
  gladys.on('ready', function () {
    // Check bluetooth state
    noble.on('stateChange', function (state) {
      if (state === 'poweredOn') {
        shared.bluetoothOn = true;
        sails.log.info('Switchbot module: Bluetooth device available');
      } else if (state === 'poweredOff') {
        shared.bluetoothOn = false;
        shared.scanning = false;
        if (shared.scanTimer) {
          clearTimeout(shared.scanTimer);
          shared.scanTimer = undefined;
        }
        sails.log.warn('Switchbot module: Bluetooth device not available');
        noble.stopScanning();
      }
      gladys.socket.emit('switchbotStatus', SwitchbotControllerUtils.generateStatus());
    });
  });

  return {
    exec: exec,
    routes: {
      before: {
        'post /switchbot/scan': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
        'get /switchbot/setup': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next)

      },
      after: {
        'post /switchbot/scan': SwitchbotController.scan,
        'get /switchbot/setup': SwitchbotController.setup

      }
    }
  };
};
