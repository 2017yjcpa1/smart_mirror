(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {

    $.fn.draggable = function (options) {
        
        var settings = $.extend({
            // TODO ...
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
                var dx = event.pageX - prevEvent.pageX;
                var dy = event.pageY - prevEvent.pageY;

                self.style.left = (x + dx) + 'px'; 
                self.style.top = (y + dy) + 'px';
                
                prevEvent = event;
            }
            
            
            $(self)
                .css('position', 'absolute')
                .bind('mousedown', mousePress)
            
        });
    };  

}));