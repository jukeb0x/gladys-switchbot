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



    var buf = new Buffer(3 + command.length);

    buf.writeUInt8(0x52 , 0);
    buf.writeUInt16LE(0x16, 1);

    for (var i = 0; i < command.length; i++) {
      buf.writeUInt8(command.readUInt8(i), i + 3);
    }


    console.log('switchbot module: byte array switchbot ' + ' (' + buf.toString() + ')');
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