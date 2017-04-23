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
            
            speechRecog.addEventListener('유튜브 실행', function () { system.startActivity('youtubeActivity'); })
            speechRecog.addEventListener('날씨 실행', function () { system.startActivity('weatherActivity'); })
            speechRecog.addEventListener('뉴스 실행', function () { system.startActivity('newsActivity'); })
            speechRecog.addEventListener('달력 실행', function () { system.startActivity('calendarActivity'); })
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