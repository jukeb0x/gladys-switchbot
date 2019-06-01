const utils = require('./SwitchbotControllerUtils.js');
const install = require('../lib/install.js');
//const meshPair = require('../lib/mesh/pair.js');
//const meshShared = require('../lib/mesh/shared.js');
//const determineCredentials = require('../lib/mesh/determineCredentials.js');

const status = {
  install: false,
  pairing: false
};

module.exports = {
  /*getRemotes: function (req, res, next) {
    gladys.device.getByService({ service: 'switchbot' }).then((devices) => {
      res.json(devices.filter(d => {
        return d.protocol === 'bluetooth-remote';
      }));
    });
  },*/
  scan: function (req, res, next) {
    install().then((result) => {
      gladys.socket.emit('switchbotDiscover', result);
    }).catch((err) => {
      gladys.socket.emit('switchbotError', err);
    }).finally(() => {
      status.install = false;
      gladys.socket.emit('switchbotStatus', utils.generateStatus(status));
    });

    status.install = true;
    res.json(utils.generateStatus(status));
  },
  setup: function (req, res, next) {
    res.json(utils.generateStatus(status));
  }/*,
  createMeshDevice: function (req, res, next) {
    const data = req.body;
    const remoteInformation = {
      remoteId: data.remoteId
    };
    data.auth = data.auth || { name: '', pass: '' };

    determineCredentials(data.device, remoteInformation, data.auth).then((credentials) => {
      remoteInformation.credentials = credentials;

      return meshPair(data.device.identifier, remoteInformation, data.auth.name, data.auth.pass).then(() => {
        const paramAddress = data.device.identifier.replace(/:/gi, '_');
        return utils.getModuleId().then((moduleId) => {
          let param = {
            name: meshShared.paramUser + paramAddress,
            value: data.auth.name,
            module: moduleId,
            description: 'switchbot user'
          };
          return gladys.param.setValue(param).then(() => {
            param = {
              name: meshShared.paramPass + paramAddress,
              value: data.auth.pass,
              module: moduleId,
              description: 'switchbot password'
            };
            return gladys.param.setValue(param);
          }).then(() => {
            param = {
              name: meshShared.paramKey + paramAddress,
              value: credentials.key.toString('hex'),
              module: moduleId,
              description: 'switchbot key'
            };
            return gladys.param.setValue(param);
          }).then(() => {
            return gladys.device.create(data);
          }).then((deviceGroup) => {
            data.device = deviceGroup.device;
            data.type = deviceGroup.types;
            gladys.socket.emit('switchbotPair', data);
          });
        });
      }).catch((err) => {
        console.log('switchbot module:', err);
        gladys.socket.emit('switchbotError', err);
      }).finally(() => {
        status.pairing = false;
        gladys.socket.emit('switchbotStatus', utils.generateStatus(status));
      });
    });

    status.pairing = true;
    res.json(utils.generateStatus(status));
  }*/
};