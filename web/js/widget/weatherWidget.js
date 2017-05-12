define([
    'jquery',
    'lib/forecast.io',
    'system',
], function ($, ForecastIO, system) {
    var w_locations = [
        {
            latitude: '35.8491',
            longitude: '128.5341'
        }
    ];
    var w_forecast = new ForecastIO({
        PROXY_SCRIPT: 'php/weather_proxy.php'
    });
    function getIcon_kor(Icon){
        var i;
        var Iconarr = new Array('clear', 'clear-day','rain' ,'clear-night', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night', 'snow', 'storm','lightning','wind');
        var Iconarr_kor = new Array('맑음', '맑은날','비', '맑은저녁', '흐림', '때때로 흐림', '때때로 흐린저녁', '눈', '낙뢰','낙뢰','바람');
        for(i=0;i<Iconarr.length;i++){
            if(Icon===Iconarr[i]){
                break;
            }
        }
        return Iconarr_kor[i];
    }
    function currentWeather() {
        w_forecast.getCurrentConditions(w_locations, function (conditions) {
            var items = '';

            for (var i = 0; i < conditions.length; i++) {

                items += '<div><img src="./res/drawable/weather_images/'
                        + conditions[i].getIcon() + '.png" height="150" width="150"></div><div>'
                        + ((conditions[i].getTemperature() - 32) / 1.8).toFixed(1)
                        + '℃ </br> '+getIcon_kor(conditions[i].getIcon()) 
                        + "</br>오존지수 : " + (conditions[i].getOzone() * 0.0001).toFixed(3)
                        + '</br><img src="./res/drawable/weather_images/precipitationProbability.png" height="35" width="35">'
                        + (conditions[i].getPrecipitationProbability() * 100).toFixed(0)+'%</div>';
            }
            $('#w_currentTemp').html(items);
        });
    }
    return {
        layoutHTML: 'widget_weather.html',
        init: function () {
            currentWeather();
        },
        blur: function () {

        },
        focus: function () {

        }
    }
})