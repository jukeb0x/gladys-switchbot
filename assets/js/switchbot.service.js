(function () {
  'use strict';

  angular
    .module('gladys')
    .factory('switchbotService', SwitchbotService);

  SwitchbotService.$inject = ['$http'];

  function SwitchbotService($http) {

    var service = {
      scan: scan,
      setup: setup,
      createDevice: createDevice
    };

    return service;

    function scan() {
      return $http({ method: 'POST', url: '/switchbot/scan' });
    }

    function setup() {
      return $http({ method: 'GET', url: '/switchbot/setup' });
    }

    function createDevice(device) {
      return $http({ method: 'POST', url: '/switchbot/create', data: device });
    }

  }
})();