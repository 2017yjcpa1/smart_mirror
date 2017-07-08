define([
    'system', 
    
    'lib/darksky-1.0', 
    
    'output/speechUtterance',
    
    'jquery', 
    'jquery-draggable'
], function (system, darksky, speechUtterance, $) {
    
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

    return {
        
        id: 'weatherActivity',
        title: '날씨',
        icon: 'ic_weather.png',
        layoutHTML: 'activity_weather.html',
        
        init: function () {
            console.log('weather init');
            
            $('#weatherActivity').draggable({ 'axis' : 'y' });
        },
        
        resume: function () {
            console.log('weather resume');
            
            darksky(
                DEBUG_LAT, 
                DEBUG_LON, 
                function (data) {
                    console.log(data);
                    
                    var ozoneComment = getOzoneComment(data.currently.ozoneLevel);
                    
                    speechUtterance.speak(ozoneComment[1]);
                    
                    // 현재날씨
                    $('#weatherActivity .current img').attr('src', data.currently.iconPath);
                    $('#weatherActivity .current .temp').html(data.currently.temp + '℃');
                    $('#weatherActivity .current .ozone').html(ozoneComment.join('<br/>'));
                    
                    var hourlyContainer = $('#weatherActivity .hourly ul').empty();
                    var weeklyContainer = $('#weatherActivity .weekly ul').empty();
                    
                    // 시간대별 날씨
                    for(var n = 0; n < data.hourly.length; ++n) {
                        
                        var hourly = $([
                                        '<li>',
                                            '<span class="hourMinutes">시:분</span>',

                                            '<img src="아이콘" width="150"/>',

                                            '<div class="temp">',
                                                '<em>온도</em>',
                                            '</div>',
                                        '</li>',
                                    ].join(''))
                                        .appendTo(hourlyContainer);
                                
                        $('.hourMinutes', hourly).text(data.hourly[n].hourMinutes);
                        $('em', hourly).text(data.hourly[n].temp + '℃');
                        $('img', hourly).attr('src', data.hourly[n].iconPath);
                    }
                    
                    // 주간별 날씨
                    for(var n = 0; n < data.daily.length; ++n) {
                        
                        var weekly = $([
                                        '<li>',
                                            '<span class="dayOfWeek">요일</span>',

                                            '<img src="아이콘" width="150"/>',

                                            '<div class="temp">',
                                                '<em class="maxTemp">최고온도</em>',
                                                '<em class="minTemp">최저온도</em>',
                                            '</div>',
                                        '</li>',
                                    ].join(''))
                                        .appendTo(weeklyContainer);
                                
                        $('.dayOfWeek', weekly).text(data.daily[n].dayOfWeek + '요일');
                        $('.minTemp', weekly).text(data.daily[n].minTemp + '℃');
                        $('.maxTemp', weekly).text(data.daily[n].maxTemp + '℃');
                        $('img', weekly).attr('src', data.daily[n].iconPath);
                    } 
                }
            )
        },
        
        pause: function () {
            console.log('weather pause');
        },
        
        destroy: function () {
            console.log('weather destroy');
        },
    }
})