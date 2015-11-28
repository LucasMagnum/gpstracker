
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
