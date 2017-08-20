define([
    'jquery',
    
    'lib/darksky-1.0',
], function ($, darksky) { 
    
    var DEBUG_LAT = '35.8491';
    var DEBUG_LON = '128.5341';
    
    return {
        
        layoutHTML: 'widget_weather.html',
        
        init: function () {
            
            darksky(
                DEBUG_LAT, 
                DEBUG_LON, 
                function (data) {                    
                    $('#weatherWidget img').attr('src', data.currently.iconPath);
                    
                    $('#weatherWidget .temp').text(data.currently.temp + '℃');
                    $('#weatherWidget .precipProbabl').text('강수확률' + data.currently.precipProbabl + '%');
                }
            )
        },
    }
})