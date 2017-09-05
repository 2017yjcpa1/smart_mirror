define([
    'jquery',
    
    'lib/darksky-1.0',
], function ($, darksky) { 
    
    var DEBUG_LAT = '35.8491';
    var DEBUG_LON = '128.5341';
    
    function loadedGPS(gps) {
        
        darksky(
            gps.coords.latitude, 
            gps.coords.longitude, 
            function (data) {                    
                $('#weatherWidget img').attr('src', data.currently.iconPath);

                $('#weatherWidget .weatherTemp').text(data.currently.temp + '℃');
                $('#weatherWidget .precipProbabl').text('강수확률 ' + data.currently.precipProbabl + '%');
            }
        )
    }
    
    return {
        
        layoutHTML: 'widget_weather.html',
        
        init: function () {
            
            navigator.geolocation.getCurrentPosition(loadedGPS);
        },
    }
})