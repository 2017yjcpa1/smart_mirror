(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    
    var __darksky__ = {
        
        lat : 0.0, // 위도
        lon : 0.0, // 경도
        
        init : function (lat, lon) {
            this.lat = lat;
            this.lon = lon;
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