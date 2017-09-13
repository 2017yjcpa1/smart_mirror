define([ 
    'system',
    'jquery',
    
    'input/speechRecog',
    'output/speechUtterance',
    'output/audioPlayer',
],function (system, $, speechRecog, speechUtter, audioPlayer) {

    var isRunning = false;
    
    var scheduleId = null;
    var styleSheet = null;
    
    var startTime = 0;
    var stopTime = 0;
    
    function clock() {
        return (new Date().getTime() / 1000);
    }
    
    function getSeconds() {
        return stopTime - clock();
    }
    
    function getPercent() {
        return getSeconds() / (stopTime - startTime) * 100;
    }
    
    function injectStyle() {
        styleSheet = $(['<style>',
            
                           'body > .activity {opacity: 0.5} ',
            
                           '#timerActivity {',
                               'visibility: visible !important;',
                               'animation: none !important;',
                           '}',
                       '</style>'].join(''));
                               
        styleSheet.appendTo('head');
    }
    
    function bomb() {
        audioPlayer.play();
    }

    function start(seconds) {
        
        if (isRunning) {
            reset();
        }
        
        startTime = clock();
        stopTime = startTime + seconds;
        
        injectStyle();
        
        scheduleId = window.setInterval(
            function () {
                var seconds = getSeconds();
                
                if (seconds < 0) {
                    reset();
                    
                    bomb();
                    return;
                }
                
                tick(seconds);
                tock(getPercent());
            }, 
            100
        );

        isRunning = true;
    }
    
    function tick(seconds) { // 째깍 째깍
        var rootLayout = $('#timerActivity');
        
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;
        
        $('em', rootLayout).text([ minutes, seconds ].join(':'));
    }
    
    function tock(percent) {
        var rootLayout = $('#timerActivity');
        
        $('i', rootLayout).css('height', percent + '%');
    }
    
    function reset() {
        var rootLayout = $('#timerActivity');

        $('i', rootLayout).css('height', 0);
        $('em', rootLayout).text('00:00');

        if (styleSheet != null) {
            styleSheet.remove();
        }

        if (scheduleId != null) {
            window.clearInterval(scheduleId);
        }

        startTime = 0;
        stopTime = 0;
        scheduleId = null;
        styleSheet = null;

        isRunning = false;
    }
    
    function registCommands() {
        speechRecog.addEventListener(
            '(타이머)?(스톱|취소|종료|정지|꺼줘|꺼져|꺼저|꺼라|꺼버려)',
            function (isFinal, transcript, matches) {
                if ( ! isRunning) {
                    return false;
                }
                
                if ( ! isFinal) {
                    return false;
                }
                
                reset();
                return true;
            }
        );
        
        speechRecog.addEventListener(
            '(([0-9]{1,2})분)?(([0-9]{1,2})초)?',
            function (isFinal, transcript, matches) {
                if ( ! system.isForegroundActivity('timerActivity')) {
                    return false;
                }
                
                if ( ! isFinal) {
                    return false;
                }
                
                var regexGroups = {
                    MINUTES: 2,
                    SECONDS: 4
                };
                
                var minutes = matches[regexGroups.MINUTES] || 0;
                var seconds = matches[regexGroups.SECONDS] || 0;
                
                if ( ! minutes && ! seconds) {
                    return false;
                }
                
                console.log('타이머', minutes + '분', seconds + '초');
                
                minutes = parseInt(minutes, 10);
                seconds = parseInt(seconds, 10);
                
                seconds += minutes * 60;
                
                start(seconds);
                return true;
            }
        );
    }

    return {
        
        id : 'timerActivity',
        title : '타이머',
        icon : 'ic_timer.png',
        layoutHTML : 'activity_timer.html',
        
        init : function () {
            console.log('timer init');

            reset();
            
            registCommands();
        },
        
        /*
         * 1. 이미 타이머가 있으면
         * 2. 
         */
        resume : function () {
            console.log('timer resume');
            
            $('#timerActivity em').fadeIn();
        },
        
        pause : function () {
            console.log('timer pause');

            $('#timerActivity em').fadeOut();
        },
        
        destroy : function () {
            console.log('timer destroy');
        },
    }
})