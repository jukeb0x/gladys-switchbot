const shared = require('./shared.js');
const Promise = require('bluebird');

module.exports = function (macAddr, type, value) {
  return new Promise((resolve, reject) => {
    console.log('switchbot module: Prepare command for switchbot ' + macAddr + ' (' + type + '=' + value + ')');
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
      return reject('switchbot module: Unknown command');
    }

    console.log('switchbot module: Built command for switchbot ' + macAddr + ' (' + command + ')');
    return resolve(command);
  });
};
/*
function checksum(data, maxPos) {
  return ((data.slice(1, maxPos).reduce(function (a, b) {
    return (a + b);
  }) + 85) & 0xFF);
};*/