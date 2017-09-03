define([
    'system', 
    
    'lib/darksky-1.0', 
    
    'jquery', 
    'jquery-draggable'
], function (system, darksky, $) {
    
    var DEBUG_LAT = '35.8491';
    var DEBUG_LON = '128.5341';
    
    function getOzoneComment(level) {
        if (level >= 1) {
            return [ "오존지수 좋음", "외출하기에 무난합니다."];
        } 
        else if (level == 0) {
            return [ "오존지수 보통", "외출하기에 무난합니다."];
        }
        else if (level == -1) {
            return [ "오존지수 나쁨", "강한 자외선에 유의하세요."];
        }
        
        return [ "오존지수 매우나쁨", "노약자와 임산부는 외출을 자제하세요."];
    }
    
    function loadedGPS(gps) {
        darksky(
            gps.coords.latitude, 
            gps.coords.longitude, 
            function (data) {
                console.log(data);

                // 현재날씨
                $('#weatherActivity .currentWeather img').attr('src', data.currently.iconPath);
                $('#weatherActivity .currentWeather .weatherTemp').html(data.currently.temp + '℃');
                $('#weatherActivity .currentWeather .ozoneComment').html(getOzoneComment(data.currently.ozoneLevel).join('<br/>'));

                var hourlyContainer = $('#weatherActivity .weatherHourly ul').css('left', 0).empty();
                var weeklyContainer = $('#weatherActivity .weatherWeekly ul').css('left', 0).empty();

                // 시간대별 날씨
                for(var n = 0; n < data.hourly.length; ++n) {

                    var weatherHourly = $([
                                    '<li>',
                                        '<span class="hourMinutes">시:분</span>',

                                        '<img src="아이콘" width="150"/>',

                                        '<div class="weatherTemp">',
                                            '<em>온도</em>',
                                        '</div>',
                                    '</li>',
                                ].join(''))
                                    .appendTo(hourlyContainer);

                    $('.hourMinutes', weatherHourly).text(data.hourly[n].hourMinutes);
                    $('em', weatherHourly).text(data.hourly[n].temp + '℃');
                    $('img', weatherHourly).attr('src', data.hourly[n].iconPath);
                }

                // 주간별 날씨
                for(var n = 0; n < data.daily.length; ++n) {

                    var weatherWeekly = $([
                                    '<li>',
                                        '<span class="dayOfWeek">요일</span>',

                                        '<img src="아이콘" width="150"/>',

                                        '<div class="weatherTemp">',
                                            '<em class="maxTemp">최고온도</em>',
                                            '<em class="minTemp">최저온도</em>',
                                        '</div>',
                                    '</li>',
                                ].join(''))
                                    .appendTo(weeklyContainer);

                    $('.dayOfWeek', weatherWeekly).text(data.daily[n].dayOfWeek + '요일');
                    $('.minTemp', weatherWeekly).text(data.daily[n].minTemp + '℃');
                    $('.maxTemp', weatherWeekly).text(data.daily[n].maxTemp + '℃');
                    $('img', weatherWeekly).attr('src', data.daily[n].iconPath);
                } 
            }
        )
    }

    return {
        
        id: 'weatherActivity',
        title: '날씨',
        icon: 'ic_weather.png',
        layoutHTML: 'activity_weather.html',
        
        init: function () {
            console.log('weather init');
            
            $('#weatherActivity .weatherHourly ul').draggable({ 'axis' : 'x' });
            $('#weatherActivity .weatherWeekly ul').draggable({ 'axis' : 'x' });
        },
        
        resume: function () {
            console.log('weather resume');
            
            navigator.geolocation.getCurrentPosition(loadedGPS);
        },
        
        pause: function () {
            console.log('weather pause');
        },
        
        destroy: function () {
            console.log('weather destroy');
        },
    }
})