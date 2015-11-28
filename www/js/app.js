var db;

function intializeDB(){
    /* When is browser should use openDatabase instead
       of cordovaSQLite.opendDB */
    if (window.cordova) {
        return $cordovaSQLite.openDB({ name: "positions.db" });
    } else {
        return window.openDatabase("positions.db", '1', 'positions', 1024 * 1024 * 100);
    }
}

function initializeTables($cordovaSQLite, db){
    var tables = {
        'positions': {
            'fields': ['datetime text primary key', 'latitude text', 'longitude text']
        },
    }

    for (table_name in tables){
        var table = tables[table_name];
        var fields_sql = table.fields.join();
        var sql = "CREATE TABLE IF NOT EXISTS " + table_name + "(" + fields_sql + ")";

        $cordovaSQLite.execute(db, sql);
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
            initializeTables($cordovaSQLite, db);
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
            "INSERT OR REPLACE INTO positions (datetime, latitude, longitude) VALUES (?, ?, ?)",
            [formattedDate, position.coords.latitude, position.coords.longitude]
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
