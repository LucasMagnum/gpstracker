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

        insertPosition: function(position){
            var formattedDate = dateFilter(new Date(), "dd/MM/yyyy HH:mm:ss");

            $cordovaSQLite.execute(
                db,
                "INSERT OR REPLACE INTO positions (datetime, latitude, longitude) VALUES (?, ?, ?)",
                [formattedDate, position.coords.latitude, position.coords.longitude]
            )
        }
    }
});

app.factory('PositionService', function($cordovaGeolocation, PositionsDB){
    var service = this;
    var positions = [];

    return {
        Tracker: function(){
            var options = {timeout: 10000, enableHighAccuracy: true};

            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                PositionsDB.insertPosition(position);

                positions.push({
                    'datetime': new Date(),
                    'latitude': position.coords.latitude,
                    'longitude': position.coords.longitude
                });

                if (positions.length > 15){
                    /* hack for memory usage */
                    positions = positions.slice(5, 15);
                }

            }, function(error){
                console.log(error);
            });
        },

        getPositions: function(){
            return positions;
        }
    }

});
