define(['system', 'lib/forecast.io', 'jquery', 'jquery-draggable'], function (system, ForecastIO, $) {

    var date;
    function getweek(date) {
        var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
        var day = new Date(date).getDay();
        var todayLabel = week[day];
        return todayLabel;
    }

    function getIcon_kor(Icon) {
        var i;
        var Iconarr = new Array('clear', 'clear-day', 'rain', 'clear-night', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night', 'snow', 'storm', 'lightning', 'wind');
        var Iconarr_kor = new Array('맑음', '맑은날', '비', '맑은저녁', '흐림', '때때로 흐림', '때때로 흐린저녁', '눈', '낙뢰', '낙뢰', '바람');
        for (i = 0; i < Iconarr.length; i++) {
            if (Icon === Iconarr[i]) {
                break;
            }
        }
        return Iconarr_kor[i];
    }
    function getOzone_grade(ozone) {
        if (ozone <= 0.030) {
            return '좋음 <br><br> 오존지수 좋음에 대한 멘트';
        }
        else if (ozone <= 0.090 && ozone > 0.030) {
            return '보통 <br><br> 오존지수 보통에 대한 멘트';
        }
        else if (ozone <= 0.150 && ozone > 0.090) {
            return '나쁨 <br><br> 강한 자외선에 유의하세요.';
        }
        else {
            return '매우나쁨 <br><br> 노약자와 임산부는 외출을 자제하세요.';
        }
    }

    return {
        id: 'weatherActivity',
        title: '날씨',
        icon: 'ic_weather.png',
        layoutHTML: 'activity_weather.html',
        init: function () {
            $('#itemList').draggable({axis: 'x'});
            $('#weatherActivity > div').draggable({axis: 'y'});
        },
        resume: function () {
            console.log('weather resume');

            var locations = [
                {
                    latitude: '35.8491',
                    longitude: '128.5341'
                }

            ];
            var forecast = new ForecastIO({
                PROXY_SCRIPT: 'php/weather_proxy.php'
            });

            forecast.getCurrentConditions(locations, function (conditions) {
                var items = '';

                for (var i = 0; i < conditions.length; i++) {

                    items += '<li><img src="./asset/drawable/weather_images/'
                            + conditions[i].getIcon() + '.png" height="256" width="256">'
                            + ((conditions[i].getTemperature() - 32) / 1.8).toFixed(1)
                            + '℃  </br> ' //+ getIcon_kor(conditions[i].getIcon())
                            + '</li>' + "</br><li class='as2'>오존지수 "
                            + getOzone_grade((conditions[i].getOzone() * 0.0001).toFixed(3)) + '</li>';
                }
                document.getElementById('currentTemp').innerHTML = items;
            });

            forecast.getForecastToday(locations, function (conditions) {
                var items2 = '';
                var items3 = '';
                for (var i = 0; i < conditions.length; i++) {
                    items2 += '<div class="secondsubdiv">' + conditions[i].getTime('HH:mm') + '</br><img src="./asset/drawable/weather_images/'
                            + conditions[i].getIcon() + '.png" height="60" width="60"></br>'
                            + ((conditions[i].getTemperature() - 32) / 1.8).toFixed(1)
                            + '℃</br><img src="./asset/drawable/weather_images/precipitationProbability.png" style="margin-top:-5px; margin-right: 7px" height="25" width="25">'
                            + (conditions[i].getPrecipitationProbability() * 100).toFixed(0)
                            + '%' + '</div>' ;
                    
                    if (conditions[i].getTime('HH') == '21') {
                        items3 = '<li><img src="./asset/drawable/weather_images/'
                                + conditions[i].getIcon() + '.png" height="100" width="100">'
                                + ((conditions[i].getTemperature() - 32) / 1.8).toFixed(1)
                                + '℃  </br> ' + getIcon_kor(conditions[i].getIcon())
                                + '</li>' + "</br><li>오존지수 "
                                + getOzone_grade((conditions[i].getOzone() * 0.0001).toFixed(3)) + '</li>';
                    }
                }

                document.getElementById('itemList').innerHTML = items2;
                document.getElementById('currentTemp2').innerHTML = items3;
            });

            forecast.getForecastWeek(locations, function (conditions) {
                var items4 = '';
                var items5 = '';//현재날씨 아랫부분
                var items6 = '';//오늘저녁날씨 아랫부분
                var items7 = '';//내일날씨
                var items8 = '';//내일날씨 아랫부분
                for (var i = 0; i < conditions.length; i++) {
                    if (i == 0) {
                        items5 = '<li>' + ((conditions[i].getMinTemperature() - 32) / 1.8).toFixed(1) + '℃/'
                                + ((conditions[i].getMaxTemperature() - 32) / 1.8).toFixed(1)
                                + '℃</li><li><img src="./asset/drawable/weather_images/precipitationProbability.png" height="40" width="40">'
                                + (conditions[i].getPrecipitationProbability() * 100).toFixed(0) + '%</li>';

                        items6 = '<li>' + ((conditions[i].getMinTemperature() - 32) / 1.8).toFixed(1) + '℃/'
                                + ((conditions[i].getMaxTemperature() - 32) / 1.8).toFixed(1)
                                + '℃</li><li><img src="./asset/drawable/weather_images/precipitationProbability.png" height="40" width="40">'
                                + (conditions[i].getPrecipitationProbability() * 100).toFixed(0) + '%</li>';

                        items4 += '<div class="thirdsubdiv"><span><img src="./asset/drawable/weather_images/'
                                + conditions[i].getIcon() + '.png" height="55" width="55">'
                                + '오늘&nbsp;&nbsp;&nbsp;:  ' 
                                + ((conditions[i].getMinTemperature() - 32) / 1.8).toFixed(1)
                                + '℃  '
                                + '<span class="bar"style="width:'
                                + (((conditions[i].getMaxTemperature() - 32) / 1.8)
                                        - ((conditions[i].getMinTemperature() - 32) / 1.8)).toFixed(1)
                                + '%;"></span>' + ((conditions[i].getMaxTemperature() - 32) / 1.8).toFixed(1)
                                + '℃<img src="./asset/drawable/weather_images/precipitationProbability.png" height="40" width="40">'
                                + (conditions[i].getPrecipitationProbability() * 100).toFixed(0)
                                + '%</span></div>';
                    }
                    else {
                        if (i == 1) {
                            items7 = '<li><img src="./asset/drawable/weather_images/'
                                    + conditions[i].getIcon() + '.png" height="100" width="100">'
                                    + ((conditions[i].getMaxTemperature() - 32) / 1.8).toFixed(1)
                                    + '℃  </br> ' + getIcon_kor(conditions[i].getIcon())
                                    + '</li>' + "</br><li>오존지수 "
                                    + getOzone_grade((conditions[i].getOzone() * 0.0001).toFixed(3)) + '</li>';
                            items8 = '<li>' + ((conditions[i].getMinTemperature() - 32) / 1.8).toFixed(1) + '℃/'
                                    + ((conditions[i].getMaxTemperature() - 32) / 1.8).toFixed(1)
                                    + '℃</li><li><img src="./asset/drawable/weather_images/precipitationProbability.png" height="40" width="40">'
                                    + (conditions[i].getPrecipitationProbability() * 100).toFixed(0) + '%</li>';
                        }
                        items4 += '<div class="thirdsubdiv"><span><img src="./asset/drawable/weather_images/'
                                + conditions[i].getIcon() + '.png" height="55" width="55">'
                                + getweek(conditions[i].getTime('YYYY-MM-DD')) + ':  '
                                + ((conditions[i].getMinTemperature() - 32) / 1.8).toFixed(1)
                                + '℃  '
                                + '<span class="bar"style="width:'
                                + (((conditions[i].getMaxTemperature() - 32) / 1.8)
                                        - ((conditions[i].getMinTemperature() - 32) / 1.8)).toFixed(1)
                                + '%;"></span>' + ((conditions[i].getMaxTemperature() - 32) / 1.8).toFixed(1)
                                + '℃<img src="./asset/drawable/weather_images/precipitationProbability.png" height="40" width="40">'
                                + (conditions[i].getPrecipitationProbability() * 100).toFixed(0)
                                + '%</span></div>';
                    }
                }
                document.getElementById('itemList3').innerHTML = items4;
                document.getElementById('currentTempbottom').innerHTML = items5;
                document.getElementById('currentTemp2bottom').innerHTML = items6;
                document.getElementById('currentTemp3').innerHTML = items7;
                document.getElementById('currentTemp3bottom').innerHTML = items8;
            });

        },
        pause: function () {
            console.log('weather pause');
        },
        destroy: function () {
            console.log('weather destroy');
        },
    }
})