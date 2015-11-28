var db;

function intializeDB(){
    if (window.cordova) {
        //device
        return $cordovaSQLite.openDB({ name: "positions.db" });
    } else {
         // browser
        return window.openDatabase("positions.db", '1', 'positions', 1024 * 1024 * 100);
    }
}


var app = angular.module('gpstracker', ['ionic', 'ngCordova'])
    .run(function($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }

            db = intializeDB();
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS positions (id integer primary key, latitude text, longitude text, datetime text)");
        });
    });



app.controller('GPSTracker', function($scope){
    $scope.CurrentDate = new Date();
    $scope.Positions = [];
    $scope.RefreshTime = 3 * 1000 * 60; // 3 minutos
});

app.controller('PositionTracker', function($scope, $cordovaGeolocation, dateFilter, $cordovaSQLite, $ionicLoading, $timeout){
    var controller = this;

    controller.savePosition = function(position){
        var formattedDate = dateFilter(new Date(), "dd/MM/yyyy HH:mm:ss");
        $cordovaSQLite.execute(
            db,
            "INSERT INTO positions (latitude, longitude, datetime) VALUES (?, ?, ?)",
            [position.coords.latitude, position.coords.longitude, formattedDate]
        )

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

        $timeout(controller.updatePosition, $scope.RefreshTime);
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
