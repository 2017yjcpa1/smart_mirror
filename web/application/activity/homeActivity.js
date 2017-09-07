define([ 
    'system',
    
    'jquery',
    
    'input/speechRecog',
    'output/speechUtterance',
],function (system, $, speechRecog, speechUtter) {
    
    function registCommands() {
        var REGEX_EXECUTE = '(.+?)(보여줘|띄워|꺼내|열어|실행|켜줘|켜저|켜봐|켜바)'; 
        var REGEX_GO_HOME = '(홈으로|홈화면|바탕화면|메인화면|메인으로)';
        var REGEX_REFRESH = '(새로고침)';
         
        speechRecog.addEventListener(
            REGEX_GO_HOME,
            function (isFinal, transcript, matches) {
                if ( ! isFinal) {
                    return false;
                }
                
                system.startActivity('homeActivity');
                return true;
            }
        );
         
        speechRecog.addEventListener(
            REGEX_REFRESH,
            function (isFinal, transcript, matches) {
                if ( ! isFinal) {
                    return false;
                }
                
                window.location.reload();
                return true;
            }
        );

        speechRecog.addEventListener(
            REGEX_EXECUTE,
            function (isFinal, transcript, matches) {
                if ( ! isFinal) {
                    return false;
                }

                var activity = matches[1].replace(/\s/g, '').toLowerCase(); 

                switch (activity) {
                    case '튜토리얼': 
                    case '모션학습': system.startActivity('tutorialActivity'); break;
                    case '일정': 
                    case '달력':     system.startActivity('calendarActivity'); break;
                    case '뉴스':     system.startActivity('newsActivity'); break;
                    case '날씨':     system.startActivity('weatherActivity'); break;
                    case '유튜브': 
                    case '유투브':   system.startActivity('youtubeActivity'); break;
                    case '카메라': 
                    case '사진기':   system.startActivity('cameraActivity'); break;
                    case '타이머':   system.startActivity('timerActivity'); break;
                    default:         return false;
                }
                
                return true;
            }
        );
    }
    
    return {
        
        id : 'homeActivity',
        title : '홈 화면',
        icon : 'ic_home.png',
        layoutHTML : 'activity_home.html',
        
        init : function () {
            console.log('home init');
            
            //system.attachWidget('notifyWidget');
            system.attachWidget('clockWidget');
            system.attachWidget('menuWidget');
            system.attachWidget('skeletonWidget');
            system.attachWidget('newsWidget');
            system.attachWidget('transcriptWidget');
            system.attachWidget('weatherWidget');
            system.attachWidget('wikiWidget');
            
            registCommands();
        },
        
        resume : function () {
            console.log('home resume');
            
            var clockWidget = system.getWidget('clockWidget');
            if (clockWidget) {
                clockWidget.focus();
            }
        },
        
        pause : function () {
            console.log('home pause');
            
            var clockWidget = system.getWidget('clockWidget');
            if (clockWidget) {
                clockWidget.blur();
            }
        },
        
        destroy : function () {
            console.log('home destroy');
        },
    }
})