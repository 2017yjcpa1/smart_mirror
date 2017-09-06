define([ 'system', 'jquery', 'jquery-draggable' ],function (system, $) {

    function exec(seconds) {
        var totalSeconds = seconds;
        
        var intervalId = window.setInterval(
            function () {
                if(seconds < 0) {
                    window.clearInterval(intervalId);
                    return;
                }
                
                tick(seconds--);
                tock(seconds / totalSeconds * 100);
            }, 
            1000
        );
    }
    
    function tick(seconds) { // 째깍 째깍
        var rootLayout = $('#timerActivity');
        
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;
        
        $('em', rootLayout).text([ minutes, seconds ].join(':'));
    }
    
    function tock(percent) {
        var rootLayout = $('#timerActivity');
        
        $('i', rootLayout).css('height', percent + '%');
    }

    return {
        
        id : 'timerActivity',
        title : '타이머',
        icon : 'ic_timer.png',
        layoutHTML : 'activity_timer.html',
        
        init : function () {
            console.log('timer init');
        },
        
        resume : function () {
            console.log('timer resume');
            
            var rootLayout = $('#timerActivity');
            
            $('i', rootLayout).css('height', 0);
            $('em', rootLayout).text('00:00');
            
            exec(90);
        },
        
        pause : function () {
            console.log('timer pause');
        },
        
        destroy : function () {
            console.log('timer destroy');
        },
    }
})