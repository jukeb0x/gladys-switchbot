const switchbotSend = require('../bluetooth/send.js');
const generateCommand = require('./generateCommand.js');

module.exports = {
  scan: {
    serviceUUIDs: ['cba20d00224d11e69fb80002a5d5c51b'],
    characteristicUUIDs: ['cba20002224d11e69fb80002a5d5c51b']
  },
  exec: function (peripheral, characteristics, type, value) {
    return generateCommand(peripheral.address, type, value).then((command) => {
      return switchbotSend(peripheral, characteristics.get(this.scan.characteristicUUIDs[0]), command);
    });
  }
};
