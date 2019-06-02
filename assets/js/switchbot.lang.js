var translationsEN = {
  SERVICE_FAIL: 'Switchbot service not available, please install again',
  INFO_TITLE: 'Information',
  INFO_CONTENT: 'Start scan to find available Switchbot devices and configure each to manage them with Gladys.',
  SCAN_TITLE: 'Scan for compatible devices',
  SCAN_START: 'Start scan',
  SCAN_RUNNING: 'Scanning...',
  SCAN_UNAVAILABLE: 'Bluetooth not available',
  SCAN_NO_FOUND: 'No devices found',
  DEVICE_CONFIG: 'Configure device',
  DEVICE_EXISTS: 'Device already exists in Gladys',
  switch: 'Switch',
  SWITCH_ON_OFF: 'Switch ON / OFF'
};

var translationsFR = {
  SERVICE_FAIL: 'Le service Switchbot n\'est pas disponible, vérifiez son installation',
  INFO_TITLE: 'Informations',
  INFO_CONTENT: 'Démarrez l\'analyse afin de rechercher les périphériques Switchbot disponibles, et de les configurer afin de les manipuler avec Gladys.',
  SCAN_TITLE: 'Analyse des périphériques compatibles',
  SCAN_START: 'Démarrer l\'analyse',
  SCAN_RUNNING: 'Analyse en cours...',
  SCAN_UNAVAILABLE: 'Le Bluetooth n\'est pas actif',
  SCAN_NO_FOUND: 'Aucun périphérique n\'a été trouvé',
  DEVICE_CONFIG: 'Configuration du périphérique',
  DEVICE_EXISTS: 'Périphérique déjà présent dans Gladys',
  switch: 'Interrupteur',
  SWITCH_ON_OFF: 'Allumer / éteindre'
};

angular
  .module('gladys')
  .config(['$translateProvider', function ($translateProvider) {
    // add translation table
    $translateProvider
      .translations('en', translationsEN)
      .translations('fr', translationsFR);
  }]);