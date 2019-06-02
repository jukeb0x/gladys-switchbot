
(function () {
  'use strict';

  angular
    .module('gladys')
    .controller('SwitchbotController', SwitchbotController);

  SwitchbotController.$inject = ['deviceService', 'roomService', 'switchbotService', '$translate', '$scope'];

  function SwitchbotController(deviceService, roomService, switchbotService, $translate, $scope) {
    var vm = this;
    vm.scan = scan;
    vm.createDevice = createDevice;
    vm.updateDevice = updateDevice;
    vm.selectDevice = selectDevice;
    vm.testDevice = testDevice;

    vm.scanning = false;
    vm.available = false;
    vm.install = false;
    vm.error = null;
    vm.mError = null;
    vm.devices = [];
    vm.rooms = [];
    vm.selectedDevice = null;
    vm.progess = false;
    vm.remotes = [];

    activate();

    function activate() {

      io.socket.on('switchbotDiscover', function (params) {
        $scope.$apply(function () {
          vm.devices = params;
          if (params.length === 0) {
            $translate('SCAN_NO_FOUND').then(function(msg){
              manageError(msg);
            });
          } else {
            manageError(null);
          }
        });
      });

      io.socket.on('switchbotStatus', function (params) {
        $scope.$apply(function () {
          vm.available = params.bluetoothOn;
          vm.scanning = params.scanning;
          vm.install = params.install;
        });
      });

      io.socket.on('switchbotError', function (params) {
        $scope.$apply(function () {
          manageError(params);
        });
      });

      switchbotService.setup()
        .then(function (result) {
          manageResult(result);
        });

      roomService.get({ take: 10000 })
        .then(function (data) {
          vm.rooms = data.data;
          vm.rooms.unshift({ id: null, name: '----' });
        });
    }


    function manageResult(result) {
      if (result.status != 200) {
        vm.devices = [];
        vm.available = false;
        $translate('SERVICE_FAIL').then(function(msg) {
          manageError(msg);
        });
      } else {
        vm.available = result.data.bluetoothOn;
        vm.scanning = result.data.scanning;
        vm.install = result.data.install;
      }
    }

    function scan() {
      vm.devices = [];

      return switchbotService.scan()
        .then(function (result) {
          manageResult(result);
        });
    }

    function createDevice(deviceGroup) {
      vm.progess = true;
      updateTypesName(deviceGroup);
      deviceService.create(deviceGroup.device, deviceGroup.types).then(function(){
        vm.progess = false;
        deviceGroup.alreadyExists = true;
        $('#modalMesh').modal('hide');
      }).catch(function(e){
        manageError(e);
        vm.progess = false;
      });
    }

    function updateDevice(deviceGroup) {
      vm.progess = true;
      updateTypesName(deviceGroup);
      deviceService.updateDevice(deviceGroup.device, deviceGroup.types).then(function(){
        vm.progess = false;
        $('#modalMesh').modal('hide');
      }).catch(function(e){
        manageError(e);
        vm.progess = false;
      });
    }


    function selectDevice(device) {
      vm.selectedDevice = device;
    }

    function updateTypesName(deviceGroup) {
      deviceGroup.types.forEach(function(element){
        element.name = deviceGroup.device.name + element.nameSuffix;
      });
    }

    function testDevice(deviceGroup) {
      vm.progess = true;
      var switchType = deviceGroup.types.filter(function(type){
        return type.identifier == 'switch';
      });

      switchType.forEach(function(element){
        return deviceService.exec(element, (!element.lastValue ? 1 : (element.lastValue + 1) % 2))
          .then(function(data){
            element.lastValue = data.data.value; 
            vm.progess = false;
          }).catch(function(e){
            manageError(e);
            vm.progess = false;
          });
      });
    }

    function manageError(e) {
      if ($('#modalMesh').hidden) {
        vm.error = e;
        vm.mError = null;
      } else {
        vm.error = null;
        vm.mError = e;
      }
    }
  }
})();