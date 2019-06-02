const switchbotScan = require('./bluetooth/scan.js');
const switchbotConnect = require('./bluetooth/connect.js');
const switchbotDiscoverServices = require('./bluetooth/discoverServices.js');
const switchbotDiscoverCharacteristics = require('./bluetooth/discoverCharacteristics.js');
const switchbotRead = require('./bluetooth/read.js');
const managePeripheral = require('./managePeripheral.js');
const shared = require('./shared.js');

const Promise = require('bluebird');

module.exports = function () {
  console.log('Switchbot module: Setting-up devices...');
  return switchbotScan().then((peripheralMap) => {
    return Promise.map(peripheralMap, (peripheralEntry) => {
      const peripheral = peripheralEntry[1];
      return switchbotConnect(peripheral).then((peripheral) => {
      console.log('Switchbot module => peripheral : '+peripheral);
        peripheral.disconnect();
        return managePeripheral(peripheral);
      }).catch((e) => {
        console.error('Switchbot module:', e);
        peripheral.disconnect();
      });
    }, { concurrency: 1 });
  }).then((result) => {
    console.log('Switchbot module: Configuration done');
    return Promise.resolve(result.filter(e => e));
  }).catch((e) => {
    console.error('Switchbot module:', e);
    return Promise.reject(e);
  });
};
