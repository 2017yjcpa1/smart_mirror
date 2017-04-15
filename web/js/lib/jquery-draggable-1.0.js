(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'math/vec2d'], factory);
    } else {
        factory(jQuery, vec2d);
    }
}(function ($, vec2d) {

    $.fn.draggable = function (options) {
        
        var settings = $.extend({
            axis : 'xy',
        }, options);
        
        return this.each(function() { 

            var self = this;
            var prevEvent = null;

            // 마우스 누르면 이벤트장착
            function mousePress(event) {
                prevEvent = event;

                $(document)
                    .bind('mousemove', mouseMove)
                    .bind('mouseup', mouseRelease)
            }

            // 마우스 떼면 이벤트해제
            function mouseRelease() {
                $(document)
                    .unbind('mousemove', mouseMove)
                    .unbind('mouseup', mouseRelease);
            }

            function mouseMove(event) {
                var x = parseInt(self.style.left, 10) || 0; 
                var y = parseInt(self.style.top, 10) || 0; 

                // ((현재이벤트 - 이전이벤트) = 움직인거리)
                var vec = vec2d(prevEvent.pageX, prevEvent.pageY).sub(event.pageX, event.pageY);

                if (settings.axis.indexOf('x') !== -1) self.style.left = (x + vec.x) + 'px'; 
                if (settings.axis.indexOf('y') !== -1) self.style.top = (y + vec.y) + 'px';
                
                $(self).trigger('drag', [ vec.length(), vec.x, vec.y ]);
                
                prevEvent = event;
            }
            
            
            $(self)
                .css({
                    'position' : 'absolute',
                    '-webkit-touch-callout': 'none', /* iOS Safari */
                      '-webkit-user-select': 'none', /* Safari */
                       '-khtml-user-select': 'none', /* Konqueror HTML */
                         '-moz-user-select': 'none', /* Firefox */
                          '-ms-user-select': 'none', /* Internet Explorer/Edge */
                              'user-select': 'none' /* Non-prefixed version, currently supported by Chrome and Opera */
                })
                .bind('mousedown', mousePress)
            
        });
    };  

}));