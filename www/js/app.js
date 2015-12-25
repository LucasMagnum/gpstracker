var app = angular.module('gpstracker', ['ionic', 'ngCordova', 'angular-svg-round-progress'])
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



app.controller('TimeTracker', function($scope, $timeout, $cordovaDialogs, PositionService){
    // Timer
    var mytimeout = null; // the current timeoutID
    var batteryIsPluggged = false;

    $scope.password = 'gpstracker';

    $scope.timeForTimer = 60; // 1 minute
    $scope.timer = $scope.timeForTimer;
    $scope.started = false;
    $scope.paused = false;

    $scope.onTimeout = function() {
        if ($scope.timer === 0) {
            $scope.timer = $scope.timeForTimer;
            PositionService.Tracker();
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
    };

    // Pauses the timer
    $scope.pauseTimer = function() {
        console.log('Pause timer');
        $scope.started = false;
        $scope.paused = true;
        $timeout.cancel(mytimeout);
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


    ionic.Platform.ready(function(){
        window.addEventListener("batterystatus", $scope.manageTracker, false);
    });
});
