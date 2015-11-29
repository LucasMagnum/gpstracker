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
    $scope.Positions = [];
    $scope.RefreshTime = 3 * 1000 * 60; // 3 minutos

});

app.controller('PositionTracker', function($scope, $cordovaGeolocation, $ionicLoading,
                                           $timeout, PositionsDB){
    var controller = this;

    controller.savePosition = function(position){
        PositionsDB.insertPosition(position);

        $scope.Positions.push({
            'datetime': new Date(),
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        });
    }

    controller.startTracker = function(){
        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            controller.savePosition(position);
        }, function(error){
            console.log(error);
        });

        $scope.startTrackerTimeout = $timeout(controller.startTracker, $scope.RefreshTime);
    }

    controller.stopTracker = function(){
        $timeout.cancel($scope.startTrackerTimeout);
    }

    $scope.getPositions = function(){
        return $scope.Positions.concat().reverse().slice(0, 6);
    };

    ionic.Platform.ready(function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Inicializando!',
            duration: 1000
        });

        controller.startTracker();
    });
});
