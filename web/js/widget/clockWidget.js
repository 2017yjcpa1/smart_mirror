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
    }
     
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_clock.html',
        
        init : function () {
            updateClock();
            
            window.setInterval(updateClock, 500);
        }
    }
})