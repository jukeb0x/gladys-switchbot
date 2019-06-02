const shared = require('./shared.js');
const Promise = require('bluebird');

module.exports = function (macAddr, type, value) {
  return new Promise((resolve, reject) => {
    console.log('Switchbot module: Prepare command for switchbot ' + macAddr + ' (' + type + '=' + value + ')');
    var command;

    if (type === 'switch') {
      if (value === 1) {
        command = shared.commands.on;
      } else if (value === 0) {
        command = shared.commands.off;
      } else {
        return reject('Unknown command');
      }
    } else {
      return reject('Switchbot module: Unknown command');
    }

    console.log('Switchbot module: Built command for switchbot ' + macAddr + ' (' + command + ')');
    return resolve(command);
  });
};