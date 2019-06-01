const switchbotConnect = require('./bluetooth/connect.js');
const switchbotDiscoverServices = require('./bluetooth/discoverServices.js');
const switchbotDiscoverCharacteristics = require('./bluetooth/discoverCharacteristics.js');
const switchbotScan = require('./bluetooth/scan.js');

const defaultExec = require('./default/exec.js');
//const meshExec = require('./mesh/exec.js');

const Promise = require('bluebird');

module.exports = function (deviceInfo) {
  const macAddr = deviceInfo.deviceType.identifier;
  const type = deviceInfo.deviceType.deviceTypeIdentifier;
  const value = deviceInfo.state.value;
  const protocol = deviceInfo.deviceType.protocol;
  //const meshNetwork = protocol == 'bluetooth-mesh';

  let executor;
  /*if (meshNetwork) {
    executor = meshExec;
  } else {*/
    executor = defaultExec;
  //}

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
      return switchbotDiscoverServices(peripheral, executor.serviceUUIDs);
    }).then((services) => {
      return switchbotDiscoverCharacteristics(peripheral, services.get(executor.scan.serviceUUIDs[0]), executor.scan.characteristicUUIDs);
    }).then((characteristics) => {
      return executor.exec(peripheral, characteristics, type, value, deviceInfo);
    }).then(() => {
      console.log('switchbot module: Command well done');
      return Promise.resolve(value);
    }).catch((e) => {
      peripheral.disconnect();
      return Promise.reject(e);
    });
  }).catch((e) => {
    console.error('switchbot module:', e);
    return Promise.reject(e);
  });
};
