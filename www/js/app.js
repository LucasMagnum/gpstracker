var app = angular.module('gpstracker', ['ionic', 'ngCordova']);

app.controller('GPSTracker', function($scope){
    $scope.CurrentDate = new Date();
    $scope.Positions = [];
    $scope.RefreshTime = 3 * 1000 * 60; // 3 minutos
});

app.controller('PositionTracker', function($scope, $cordovaGeolocation, $ionicLoading){
    var controller = this;

    controller.savePosition = function(position){
        $scope.Positions.push({
            'datetime': new Date(),
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        });
    }

    controller.updatePosition = function(){
        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            controller.savePosition(position);
            $ionicLoading.hide();
        }, function(error){
            $ionicLoading.hide();
            console.log(error);
        });

        setTimeout(controller.updatePosition, $scope.RefreshTime);
    }


    ionic.Platform.ready(function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Inicializando!'
        });

        $scope.getPositions = function(){
            return $scope.Positions.concat().reverse().slice(0, 6);
        };

        controller.updatePosition();

    });
});


app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});


app.directive("currentTime", function(dateFilter){
    return function(scope, element, attrs){
        var format = attrs.currentTime;

        function updateTime(){
            var dt = dateFilter(new Date(), format);
            element.text(dt);
        }

        function updateLater() {
            setTimeout(function() {
              updateTime();
              updateLater();
            }, 1000);
        }

        updateLater();
    }
});
