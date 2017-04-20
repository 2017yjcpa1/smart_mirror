(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } 
    else {
        root.darksky = factory(jQuery);
    }
}(this, function ($) {
    
    var __darksky__ = {
        
        lat : 0.0, // 위도
        lon : 0.0, // 경도
        
        init : function (lat, lon) {
            this.lat = lat;
            this.lon = lon;
        },
        
        result : function (data) {
            console.log(data);
        },
        
        exec : function () {
            var args = {};
            args.lan = this.lan;
            args.lon = this.lon;
            
            $.getJSON('php/weather.php?' + $.param(args), this.result);
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