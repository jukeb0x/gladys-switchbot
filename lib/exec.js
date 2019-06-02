const switchbotConnect = require('./bluetooth/connect.js');
const switchbotDiscoverServices = require('./bluetooth/discoverServices.js');
const switchbotDiscoverCharacteristics = require('./bluetooth/discoverCharacteristics.js');
const switchbotScan = require('./bluetooth/scan.js');

const defaultExec = require('./default/exec.js');

const Promise = require('bluebird');

module.exports = function (deviceInfo) {
  const macAddr = deviceInfo.deviceType.identifier;
  const type = deviceInfo.deviceType.deviceTypeIdentifier;
  const value = deviceInfo.state.value;
  const protocol = deviceInfo.deviceType.protocol;

  let executor;
  executor = defaultExec;

  var tmpPeripheral = new Map();
  tmpPeripheral.set(macAddr, deviceInfo);

  return switchbotScan(tmpPeripheral).then((peripherals) => {
    if (peripherals && peripherals.has(macAddr)) {
      return peripherals.get(macAddr);
    } else {
      return Promise.reject(macAddr + ' not found');
    }
  }).then((peripheral) => {
    return switchbotConnect(peripheral).then((peripheral) => {
      return switchbotDiscoverServices(peripheral, executor.scan.serviceUUIDs);
    }).then((services) => {
      console.log('Switchbot module service => '+JSON.stringify(services));
      return switchbotDiscoverCharacteristics(peripheral, services.get(executor.scan.serviceUUIDs[0]), executor.scan.characteristicUUIDs);
    }).then((characteristics) => {
      return executor.exec(peripheral, characteristics, type, value, deviceInfo);
    }).then(() => {
      console.log('Switchbot module: Command well done');
      return Promise.resolve(value);
    }).catch((e) => {
      peripheral.disconnect();
      return Promise.reject(e);
    });
  }).catch((e) => {
    console.error('Switchbot module:', e);
    return Promise.reject(e);
  });
};
