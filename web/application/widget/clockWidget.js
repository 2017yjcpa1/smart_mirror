define([ 
    'jquery',
    'system',
], function ($, system) {
    
    function currentDate() {
        var date = new Date();
        
        var years = date.getFullYear();
        var month = date.getMonth() + 1;
        var dayOfMonth = date.getDate();
        var dayOfWeek = ['일','월','화','수','목','금','토'][date.getDay()];
        
        return [ 
            years + '년',
            month + '월',
            dayOfMonth + '일',
            dayOfWeek + '요일' ];
    }
    
    function currentTime() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        if (hours === 0) hours = '12';
        if (hours <= 9) hours = '0' + hours;
        if (minutes <= 9) minutes = '0' + minutes;
        if (seconds <= 9) seconds = '0' + seconds;

        return [ 
            hours, 
            minutes, 
            seconds ];
    }
    
    function updateClock() {
        var rootLayout = $('#clockWidget');
        
        var date = currentDate();
        var time = currentTime();
        
        $('.currentTime .hoursMinutes', rootLayout).text(time[0] + ':' + time[1]);
        $('.currentTime .seconds', rootLayout).text(time[2]);
        
        $('.currentDate', rootLayout).text(date.join(' '));
        
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
                .addClass('shownSmall')
                .css({ 'left' : windowWidth / 2 - 80 / 2  });
        },
        
        focus : function () {
            $('#clockWidget')
                .removeClass('shownSmall')
                .css({ left: '0' });
        }
    }
})