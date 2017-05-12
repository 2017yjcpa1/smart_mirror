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
    function currentWeather() {
        w_forecast.getCurrentConditions(w_locations, function (conditions) {
            var items = '';

            for (var i = 0; i < conditions.length; i++) {

                items += '<li><img src="./res/drawable/weather_images/'
                        + conditions[i].getIcon() + '.png" height="100" width="100">'
                        + ((conditions[i].getTemperature() - 32) / 1.8).toFixed(1)
                        + '℃  ' + '</li>' + "<li>오존지수: " + (conditions[i].getOzone() * 0.0001).toFixed(3) + '</li>';
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