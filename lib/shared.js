
module.exports = {
  bluetoothOn: false,
  scanning: false,
  scanForNb: 0,
  scanTimer: null,
  scanTimeout: 15000,
  connectTimeout: 5000,
  serviceTimeout: 5000,
  characteristicTimeout: 5000,
  readTimeout: 5000,
  sendTimeout: 5000,
  services: {
    exec: 'cba20d00224d11e69fb80002a5d5c51b'
  },
  characteristics: {
    command: 'cba20002224d11e69fb80002a5d5c51b'
  },
};