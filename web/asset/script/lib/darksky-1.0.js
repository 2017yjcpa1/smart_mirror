(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } 
    else {
        root.darksky = factory(jQuery);
    }
}(this, function ($) {
    
    var caches = {};
    
    var __darksky__ = {
        
        lat : 0.0, // 위도
        lon : 0.0, // 경도
        
        init : function (lat, lon) {
            this.lat = lat;
            this.lon = lon;
        },
        
        loadCurrent : function (func) {
            this.exec(function (data) { 
                func(data.currently); 
            });
        },
        
        loadToday : function (func) {
            this.exec(function (data) {
                func(data.hourly); 
            });
        },
        
        loadWeek : function (func) {
            this.exec(function (data) {
                func(data.daily); 
            });
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
                './weather/?' + query,
                function (data) {
                    caches[query] = data;
                    
                    func(data);
                }
            );
        }
    }
    
    function darksky(lat, lon) {
        function F() {};
        F.prototype = __darksky__;
        
        var f = new F();
        f.init(lat, lon);
        return f;
    }
    
    return darksky;
}));