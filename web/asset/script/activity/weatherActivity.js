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
            return [ "오존지수 좋음", "오존지수 좋음에 대한 멘트"].join('<br/>');
        } 
        else if(level == 0) {
            return [ "오존지수 보통", "오존지수 보통에 대한 멘트"].join('<br/>');
        }
        else if(level == -1) {
            return [ "오존지수 나쁨", "강한 자외선에 유의하세요."].join('<br/>');
        }
        
        return [ "오존지수 매우나쁨", "노약자와 임산부는 외출을 자제하세요."].join('<br/>');
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
                    // 현재날씨
                    $('#weatherActivity .current img').attr('src', data.currently.iconPath);
                    $('#weatherActivity .current .temp').html(data.currently.temp + '℃');
                    $('#weatherActivity .current .ozone').html(getOzoneComment(data.currently.ozoneLevel));
                    
                    // 시간대별 날씨
                    // 시간, 온도, 강수확률
                    
                    // 주간별 날씨
                    // 요일, 최고온도, 최저온도, 강수확률
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