var app = angular.module('gpstracker', ['ionic', 'ngCordova'])
    .run(function($ionicPlatform, PositionsDB) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }

            // Initialize DB
            PositionsDB.initializeDB();
            PositionsDB.initializeTables();
        });
    });

app.controller('GPSTracker', function($scope){
    $scope.CurrentDate = new Date();
    $scope.RefreshTime = 3 * 1000 * 60; // 3 minutos

});

app.controller('PositionTracker', function($scope, $ionicLoading, $timeout, PositionService){
    var controller = this;
    var trackerTimeout;
    var batteryIsPluggged = false;

    $scope.getPositions = function(){
        return PositionService.getPositions().concat().reverse().slice(0, 6);
    };

    controller.watch = function(){
        $scope.isTracking = true;

        PositionService.Tracker()
        trackerTimeout = $timeout(controller.watch, $scope.RefreshTime);
    }

    controller.stopWatch = function(){
        $timeout.cancel(trackerTimeout);
        $scope.isTracking = false;
    }

    controller.manageTracker = function(batteryStatus){
        /* if battery was changed status */
        if (batteryStatus.isPlugged != batteryIsPluggged){
            if (batteryStatus.isPlugged){
                controller.watch();
            } else {
                controller.stopWatch();
            }
        }
        batteryIsPluggged = batteryStatus.isPlugged;
    }

    ionic.Platform.ready(function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Inicializando!',
            duration: 1000
        });

        window.addEventListener("batterystatus", controller.manageTracker, false);
    });
});
