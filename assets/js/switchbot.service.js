(function () {
  'use strict';

  angular
    .module('gladys')
    .factory('switchbot Service', SwitchbotService);

  SwitchbotService.$inject = ['$http'];

  function SwitchbotService($http) {

    var service = {
      scan: scan,
      setup: setup,
      createDevice: createDevice/*,
      getRemotes: getRemotes*/
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

    /*function getRemotes() {
      return $http({ method: 'GET', url: '/switchbot/remotes' });
    }*/
  }
})();