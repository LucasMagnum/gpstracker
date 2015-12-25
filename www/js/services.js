app.factory('PositionsDB', function($cordovaSQLite, dateFilter){
    var db;
    var tables = {
        'positions': {
            'fields': ['datetime text primary key', 'latitude text', 'longitude text']
        },
    }

    return {
        initializeDB: function(){
            if (window.cordova) {
                db = $cordovaSQLite.openDB({ name: "positions.db" });
            } else {
                db = window.openDatabase("positions.db", '1', 'positions', 1024 * 1024 * 100);
            }
        },

        initializeTables: function(){
            for (table_name in tables){
                var table = tables[table_name];
                var fields_sql = table.fields.join();
                var sql = "CREATE TABLE IF NOT EXISTS " + table_name + "(" + fields_sql + ")";

                $cordovaSQLite.execute(db, sql);
            }
        },

        insertPosition: function(datetime, latitude, longitude){
            $cordovaSQLite.execute(
                db,
                "INSERT OR REPLACE INTO positions (datetime, latitude, longitude) VALUES (?, ?, ?)",
                [datetime, latitude, longitude]
            );
        },

        getPositions: function(positions){
            if (db){
                var callback = function(results){
                    console.log('Test');
                    console.log('Results', results);
                }
                $cordovaSQLite.execute(
                    db,
                    "SELECT datetime, latitude, longitude FROM positions"
                ).then(callback);
            }
        }
    }
});

app.factory('PositionService', function($cordovaGeolocation, PositionsDB, dateFilter){
    var positions = [];

    function hasDate(formattedDate, positionsArray){
        /* avoid duplicated results */
        for (var i=0; i<positionsArray.length; i++){
            var arrayPosition = positionsArray[i];
            if (arrayPosition.formattedDate == formattedDate){
                return true;
            }
        }
        return false;
    }

    function transformDMS(position){
        // Return a position in DMS format
        var D = Math.abs(parseInt(position));
        var M = parseInt(position * 60 % 60);
        var S = parseInt(Math.abs(position) * 3600 % 60);

        return D + "° " + M + "' " + S + "\"";
    }

    return {
        Tracker: function(){
            var options = {timeout: 10000, enableHighAccuracy: false};

            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                var latitude = transformDMS(position.coords.latitude);
                var longitude = transformDMS(position.coords.longitude);

                var datetime = new Date();
                var formattedDate = dateFilter(datetime, "dd/MM/yyyy HH:mm:ss");

                if (hasDate(formattedDate, positions)){
                    return;
                }

                PositionsDB.insertPosition(formattedDate, latitude, longitude);

                positions.push({
                    'formattedDate': formattedDate,
                    'latitude': latitude,
                    'longitude': longitude
                });

                if (positions.length > 15){
                    /* hack for memory usage */
                    positions = positions.slice(5, 15);
                }

                console.log('Localização gravada com sucesso');

            }, function(error){
                console.log('Não foi possivel pegar sua posição');
            });
        },

        getPositions: function(){
            return positions;
        }
    }
});
