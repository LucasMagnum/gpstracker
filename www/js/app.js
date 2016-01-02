var app = angular.module('gpstracker', ['ionic','ngCordova', 'angular-svg-round-progress'])
    .run(function($ionicPlatform, PositionsDB) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }

            // Initialize DB
            console.log("Inicializando o banco de dados");
            PositionsDB.initializeDB();
            PositionsDB.initializeTables();
        });
    });

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'TimeTracker'
    })
    .state('history', {
      url: '/history',
      templateUrl: 'history.html',
      controller: 'TimeTracker'
    })
  $urlRouterProvider.otherwise("/");

});


app.controller('TimeTracker', function($scope, $timeout, $cordovaDialogs, PositionService){
    // Timer
    var mytimeout = null; // the current timeoutID
    var batteryIsPluggged = false;

    $scope.password = 'gpstracker';

    $scope.timeForTimer = 60;
    $scope.timer = $scope.timeForTimer;
    $scope.started = false;
    $scope.paused = false;

    $scope.onTimeout = function() {
        if ($scope.timer === 0) {
            $scope.timer = $scope.timeForTimer;
            console.log('Loop timer');
        }
        $scope.timer--;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    // Start timer
    $scope.startTimer = function() {
        console.log('Start timer');
        mytimeout = $timeout($scope.onTimeout, 1000);
        $scope.started = true;
        $scope.bgGeo.start();
    };

    // Pauses the timer
    $scope.pauseTimer = function() {
        console.log('Pause timer');
        $scope.started = false;
        $scope.paused = true;
        $timeout.cancel(mytimeout);
        $scope.bgGeo.stop();
    };

    // This function helps to display the time in a correct way in the center of the timer
    $scope.humanizeDurationTimer = function(input, units) {
        // units is a string with possible values of y, M, w, d, h, m, s, ms
        if (input == 0) {
            return 0;
        } else {
            var duration = moment().startOf('day').add(input, units);
            var format = "";
            if (duration.hour() > 0) {
                format += "H[h] ";
            }
            if (duration.minute() > 0) {
                format += "m[m] ";
            }
            if (duration.second() > 0) {
                format += "s[s] ";
            }
            return duration.format(format);
        }
    };

    $scope.passwordDialog = function(msg, callback){
        $cordovaDialogs.prompt('Senha', msg , ['Ok', 'Cancelar'])
        .then(function(result) {
          var passwordValue = result.input1;
          var btnIndex = result.buttonIndex;

          if (btnIndex == 1) {
            if (passwordValue != $scope.password){
                $scope.passwordDialog('Senha incorreta, tente novamente', callback);
            } else {
                callback();
            }
          }
        });
    }

    $scope.unlockTimer = function() {
        $scope.passwordDialog('Informe sua senha para desbloquear', $scope.startTimer);
    };

    $scope.lockTimer = function() {
        $scope.passwordDialog('Informe sua senha para bloquear', $scope.pauseTimer);
    };

    $scope.manageTracker = function(batteryStatus){
        /* if battery was changed status */
        if (batteryStatus.isPlugged != batteryIsPluggged){
            if (batteryStatus.isPlugged){
                console.log("Bateria conectada, iniciando o timer");
                $scope.startTimer();
            } else {
                console.log("Bateria desconectada, desligando o timer");
                $scope.pauseTimer();
            }
        }
        batteryIsPluggged = batteryStatus.isPlugged;
    }

    $scope.getPositions = function(){
        return PositionService.getPositions().concat().reverse().slice(0, 3);
    }

    $scope.getAllPositions = function (){
        PositionService.getAllPositions($scope);
    }

    $scope.exportData = function(){
        var positionsCSV = PositionService.convertToCSV($scope.positions);
        var date = new Date();

        cordova.plugins.email.open({
            to:      '',
            cc:      '',
            bcc:     '',
            subject: 'Date export '+ date,
            body:    '',
            attachments: 'base64:export.csv//'+btoa(positionsCSV)
        });
    }

    $scope.cleanData = function(){
        $cordovaDialogs.confirm('Limpar base?', 'Confirmar' , ['Ok', 'Cancelar'])
        .then(function(buttonIndex){
          if (buttonIndex == 1) {
            console.log("Apagando todos os dados");
            PositionService.deleteAllPositions();
            $scope.bgGeo.deleteAllLocations();
            PositionService.getAllPositions($scope, true);

            $cordovaDialogs.alert('Em instantes o histórico será atualizado.', 'Dados apagados');
          }
        });


    }

    ionic.Platform.ready(function(){
        window.addEventListener("batterystatus", $scope.manageTracker, false);

        var options = {
            desiredAccuracy: 10,
            stationaryRadius: 0,
            distanceFilter: 0,

            notificationIconColor: '#4CAF50',
            notificationTitle: 'GPSTracker',
            notificationText: 'Rodando...',

            debug: false,
            stopOnTerminate: false,
            interval: $scope.timeForTimer * 1000,
            activitiesInterval: $scope.timeForTimer * 2000
        };

        var callbackFn = function(location) {
            console.log('BackgroundGeoLocation success');
            PositionService.savePosition(location.latitude, location.longitude);
            $scope.timer = 0;
            $scope.bgGeo.finish();
        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error');
        }

        if (window.plugins && window.plugins.backgroundGeoLocation){
            console.log('BackgroundGeoLocation iniciando');
            $scope.bgGeo = window.plugins.backgroundGeoLocation;
            $scope.bgGeo.configure(callbackFn, failureFn, options);
        }

    });
});
