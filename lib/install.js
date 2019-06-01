const switchbotScan = require('./bluetooth/scan.js');
const switchbotConnect = require('./bluetooth/connect.js');
const switchbotDiscoverServices = require('./bluetooth/discoverServices.js');
const switchbotDiscoverCharacteristics = require('./bluetooth/discoverCharacteristics.js');
const switchbotRead = require('./bluetooth/read.js');
const managePeripheral = require('./managePeripheral.js');

const Promise = require('bluebird');

module.exports = function () {
  console.log('switchbot module: Setting-up devices...');

  return switchbotScan().then((peripheralMap) => {
    return Promise.map(peripheralMap, (peripheralEntry) => {
      const peripheral = peripheralEntry[1];
      return switchbotConnect(peripheral).then((peripheral) => {
        return switchbotDiscoverServices(peripheral, ['180a']);
      }).then((services) => {
        const characteristicsMap = new Map();
        return Promise.map(services, serviceEntry => {
          return switchbotDiscoverCharacteristics(peripheral, serviceEntry[1], ['2a29', '2a24']).then((characteristics) => {
            characteristics.forEach((value, key) => {
              characteristicsMap.set(key, value);
            });
          });
        }, { concurrency: 1 }).then(() => {
          return Promise.resolve(characteristicsMap);
        });
      }).then((characteristics) => {
        const valueMap = new Map();
        return Promise.map(characteristics, characteristicEntry => {
          return switchbotRead(peripheral, characteristicEntry[1]).then((value) => {
            valueMap.set(characteristicEntry[0], value);
            return Promise.resolve(value);
          }, { concurrency: 1 });
        }).then(() => {
          return Promise.resolve(valueMap);
        });
      }).then((values) => {
        peripheral.disconnect();
        return managePeripheral(peripheral, values);
      }).catch((e) => {
        console.error('switchbot module:', e);
        peripheral.disconnect();
      });
    }, { concurrency: 1 });
  }).then((result) => {
    console.log('switchbot module: Configuration done');
    return Promise.resolve(result.filter(e => e));
  }).catch((e) => {
    console.error('switchbot module:', e);
    return Promise.reject(e);
  });
};
