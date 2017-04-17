define([ 
    'jquery',
    'system',
], function ($, system) {
    
    function toString() {
        var date = new Date();
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()

        if (hours == 0 ) {
            hours = '12';
        }

        if (minutes <= 9) {
            minutes = '0' + minutes;
        }

        if (seconds <= 9) {
            seconds = '0' + seconds;
        }

        return [ hours, minutes, seconds ].join(':');
    }
    
    function updateClock() {
        $('#clockWidget span').text(toString());
        
        window.setTimeout(updateClock, 500);
    }
     
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_clock.html',
        
        init : function () {
            updateClock();
        },
        
        blur : function () {
            var windowWidth = $(window).width();
            
            $('#clockWidget')
                .addClass('blur')
                .css({ 'left' : windowWidth / 2 - 400 / 2  });
        },
        
        focus : function () {
            $('#clockWidget')
                .removeClass('blur')
                .css({ left: '0' });
        }
    }
})