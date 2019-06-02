const Promise = require('bluebird');

/**
 * Checks for current device if switchbot compatible, and add it as new device in Gladys.
 */
module.exports = function (peripheral) {
  const macAddress = peripheral.address;
    return generateDevice(macAddress).then((deviceGrp) => {
      return gladys.device.getByIdentifier(deviceGrp.device).then((storedDevice) => {
        deviceGrp.alreadyExists = true;
        deviceGrp.device.id = storedDevice.id;
        deviceGrp.device.name = storedDevice.name;
        deviceGrp.device.room = storedDevice.room;
        deviceGrp.device.user = storedDevice.user;
        deviceGrp.device.machine = storedDevice.machine;
        return Promise.resolve(deviceGrp);
      }).catch(() => {
        return Promise.resolve(deviceGrp);
      });
    });
};

function generateDevice(macAddress) {
  const deviceName = 'switchbot_'+macAddress;

  const gladysDevice = {
    name: deviceName,
    identifier: macAddress,
    service: 'switchbot',
    protocol:'bluetooth'
  };

  return Promise.resolve({
    device: gladysDevice,
    types: generateDeviceTypes()
  });
}

function generateDeviceTypes() {
  const types = [];
    types.push({
      type: 'binary',
      nameSuffix: '',
      identifier: 'switch',
      sensor: false,
      category: 'light',
      min: 0,
      max: 1,
      display: true
    });
  return types;
}