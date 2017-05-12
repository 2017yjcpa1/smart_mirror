define([ 
    'system',
    
    'input/speechRecog'
],function (system, speechRecog) {
    
    return {
        
        id : 'homeActivity',
        title : '홈 화면',
        icon : 'ic_home.png',
        layoutHTML : 'activity_home.html',
        
        init : function () {
            console.log('home init');
            
            system.attachWidget('clockWidget');
            system.attachWidget('menuWidget');
            system.attachWidget('skeletonWidget');
            system.attachWidget('transcriptWidget');
            system.attachWidget('weatherWidget');
            system.attachWidget('calendarWidget');
 

            
            speechRecog.addEventListener('(유튜브|유투브)\\s*실행', function (isFinal) { if (isFinal) system.startActivity('youtubeActivity'); })
            speechRecog.addEventListener('날씨\\s*실행', function (isFinal) { if (isFinal) system.startActivity('weatherActivity'); })
            speechRecog.addEventListener('뉴스\\s*실행', function (isFinal) { if (isFinal) system.startActivity('newsActivity'); })
            speechRecog.addEventListener('(달력|일정)\\s*실행', function (isFinal) { if (isFinal) system.startActivity('calendarActivity'); })
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