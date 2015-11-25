var app = angular.module('gpstracker', ['ionic', 'ngCordova']);

app.controller('GPSTracker', function($scope){
  $scope.CurrentDate = new Date();
  $scope.Locations = [];
});

app.controller('LocationTracker', function($scope, $cordovaGeolocation, $ionicLoading){
     ionic.Platform.ready(function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Inicializando!'
        });
     });

     function getLocation(){
        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            $scope.Locations.push({
                'datetime': new Date(),
                'latitude': position.coords.latitude,
                'longitude': position.coords.longitude
            });
            console.log($scope.Locations);
            $ionicLoading.hide();
        }, function(error){
            $ionicLoading.hide();
            console.log(error);
            console.log("Could not get location");
        });

        setTimeout(getLocation, 5000);
     }

    $scope.getLocations = function(){
        return $scope.Locations.concat().reverse().slice(0, 6);
    };

    getLocation();

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
