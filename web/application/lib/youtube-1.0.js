(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } 
    else {
        root.youtube = factory(jQuery);
    }
}(this, function ($) {
    
    var APIKEY = 'AIzaSyASFltS6aSwHYy6q9ft-KIH8wAB0-rEHfs';
    var SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
    
    var caches = {};
    
    var __youtube__ = {
        
        query : '',
         
        init : function (query) {
            this.query = query;
        },
        
        renewal : function (data) {
            return {
                id : data.id.videoId,
                title : data.snippet.title,
                description : data.snippet.description,
                thumbnail : data.snippet.thumbnails.high.url,
                publishedAt : data.snippet.publishedAt,
            }
        },
        
        exec : function (func) {
            var self = this;
            var query = $.param({ 
                                part: ['snippet', 'id'].join(','),
                                q: self.query,
                                type: 'video',
                                key: APIKEY 
                            });
                        
            if (caches[query]) {
                func(caches[query]);
                return;
            }
            
            $.get(
                SEARCH_URL, 
                query,
                function (data) {
                    
                    var renewal = {
                        items : []
                    };
                    
                    var items = data.items;
                    for(var n = 0; n < items.length; ++n) {
                        renewal.items.push(self.renewal(items[n]));
                    }
                    
                    caches[query] = renewal;
                    
                    func(renewal);
                }
            );
        }
    }
    
    function youtube(query, loaded) {
        function F() {};
        F.prototype = __youtube__;
        
        var f = new F();
        f.init(query);
        
        if (typeof(loaded) === 'function') {
            f.exec(loaded);
        }
        return f;
    }
    
    return youtube;
}));