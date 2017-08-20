(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } 
    else {
        root.darksky = factory(jQuery);
    }
}(this, function ($) {
    
    // 일정시간이 지나면 캐시를 지워야함.
    var caches = {};
    
    function toKoreanComment(value) {
        var table = {
            'clear' :               '맑음',
            'clear-day' :           '맑은날',
            'rain' :                '비',
            'clear-night' :         '맑은저녁',
            'cloudy' :              '흐림',
            'partly-cloudy-day' :   '때때로 흐림',
            'partly-cloudy-night' : '때때로 흐린저녁',
            'snow' :                '눈',
            'storm' :               '낙뢰',
            'lightning' :           '낙뢰',
            'wind' :                '바람',
        }
        
        return value.replace(/^(.*?)$/, function(match) {
            return table[match];
        });
    }
    
    function toKoreanDayOfWeek(dayOfWeek) {
        var koreanDayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        
        return koreanDayOfWeek[dayOfWeek];
    }
    
    function getIconPath(value) {
        var table = {
            'clear' :               'ic_clear.png',
            'clear-day' :           'ic_clear.png',
            'rain' :                'ic_rain.png',
            'clear-night' :         'ic_clear_night.png',
            'cloudy' :              'ic_cloudy.png',
            'partly-cloudy-day' :   'ic_partly_cloudy_day.png',
            'partly-cloudy-night' : 'ic_partly_cloudy_night.png',
            'snow' :                'ic_snowy.png',
            'storm' :               'ic_storm.png',
            'lightning' :           'ic_storm.png',
            'wind' :                'ic_windy.png',
        }
        
        return './asset/drawable/activity_weather/' + value.replace(/^(.*?)$/, function(match) {
            return table[match];
        });
    }
    
    function getOzoneLevel(value) {
        if (value <= 0.030) {
            return 1;
        }
        else if (0.030 < value && value <= 0.090) {
            return -1;
        }
        else if (0.090 < value && value <= 0.150) {
            return -2;
        }
        else {
            return -3;
        }
    }
    
    function toFahrenheit(value) {
        return parseFloat(((value - 32) / 1.8).toFixed(1));
    }
    
    var __darksky__ = {
        
        lat : 0.0, // 위도
        lon : 0.0, // 경도
        
        init : function (lat, lon) {
            this.lat = lat;
            this.lon = lon;
        },
        
        renewal : function (data) {
            
            var date = new Date(data.time * 1000);
            
            return {
                timestamp : data.time,
                
                dayOfWeek : toKoreanDayOfWeek(date.getDay()), // 요일
                hourMinutes : [ 
                    String(date.getHours()).padStart(2, '0'), 
                    String(date.getMinutes()).padStart(2, '0') ].join(':'), // 시,분
                daysMonth : [ 
                    String(date.getMonth() + 1).padStart(2, '0'), 
                    String(date.getDate()).padStart(2, '0') ].join('/'), // 일,월 
                
                comment : toKoreanComment(data.icon), // 간단한 설명
                iconPath : getIconPath(data.icon), // 아이콘경로
                
                minTemp : toFahrenheit(parseFloat(data.temperatureMin)), // 최저온도
                maxTemp : toFahrenheit(parseFloat(data.temperatureMax)), // 최고온도
                temp : toFahrenheit(parseFloat(data.temperature)), // 온도
                
                precipProbabl : Math.floor(data.precipProbability * 100), // 강수확률
                
                ozoneLevel: getOzoneLevel(data.ozone * 0.0001), // 오존레벨
            }
        },
        
        exec : function (func) {
            var self = this;
            var query = $.param({
                            lat : self.lat,
                            lon : self.lon
                        });
                        
            if (caches[query]) {
                func(caches[query]);
                return;
            }
            
            $.getJSON(
                'http://' + API_SERVER_URL + '/weather/?' + query,
                function (data) {
                    
                    var renewal = {
                        daily : [],
                        hourly : [],
                        currently : {}
                    };
                    
                    var daily = data.daily.data;
                    var hourly = data.hourly.data;
                    var currently = data.currently;
                    
                    for(var n = 0; n < daily.length; ++n) {
                        renewal.daily.push(self.renewal(daily[n]));
                    }
                    
                    for(var n = 0; n < hourly.length; ++n) {
                        renewal.hourly.push(self.renewal(hourly[n]));
                    }
                    
                    renewal.currently = self.renewal(currently);
                    
                    caches[query] = renewal;
                    
                    func(renewal);
                }
            );
        }
    }
    
    function darksky(lat, lon, loaded) {
        function F() {};
        F.prototype = __darksky__;
        
        var f = new F();
        f.init(lat, lon);
        
        if (typeof(loaded) === 'function') {
            f.exec(loaded);
        }
        return f;
    }
    
    return darksky;
}));