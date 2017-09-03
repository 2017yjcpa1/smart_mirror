define([ 
    'system',
    
    'jquery',
    
    'input/speechRecog',
    'output/speechUtterance',
],function (system, $, speechRecog, speechUtterance) {
    
    function registWikiCommand() {
        
        var SUFFIX = [
            '뭐지',
            '뭐냐',
            '뭐야',
            '찾아줘',
            '찾아봐',
            '찾아',
            '검색해줘',
            '검색해',
            '검색',
        ];
        
        return (function () {
            speechRecog.addEventListener(
                '^(.+?)(' + SUFFIX.join('|') + ')', 
                function (isFinal, transcript, matches) {
                    console.log(isFinal, transcript, matches[1]);

                    if (system.isForegroundActivity('youtubeActivity')) {
                        return false;
                    }

                    if ( ! isFinal) {
                        return false;
                    }

                    var url = window.URL.createEndpointURL('wiki', { 'q' : matches[1] });
                    var func = function (data) {
                        if ( ! data || data.length <= 0) {
                            speechUtterance.speak('적절한 답변을 찾지 못하였습니다.');
                            return;
                        }

                        var data = data[0].replace(/\([^\)]+\)/gi, "")
                                          .replace(/\[[^\]]+\]/gi, "")
                                          .replace(/\{[^\}]+\}/gi, "")
                                          .replace(/『[^』]+』/gi, "")
                                          .replace(/《[^》]+》/gi, "")
                                          .replace(/「[^」]+」/gi, "")
                                          .replace(/〈[^〉]+〉/gi, "");
                                  
                        console.log(data);

                        speechUtterance.speak(data);
                    }

                    $.getJSON(url, func);
                    return true;
                }
            )
        })();
    }
    
    function registExecCommand() {
        
        var SUFFIX = [
            '보여줘',
            '띄워줘',
            '띄워',
            '꺼내줘',
            '꺼내',
            '열어줘',
            '열어봐',
            '열어',
            '실행해줘',
            '실행해',
            '실행',
            '켜줘',
            '켜봐',
            '켜'
        ];
        
        return (function () {
            
            speechRecog.addEventListener(
                '^(.+?)(' + SUFFIX.join('|') + ')', 
                function (isFinal, transcript, matches) { 
                    console.log(isFinal, transcript, matches[1]);

                    if ( ! isFinal) {
                        return;
                    }

                    var activity = matches[1].replace(/\s/g, '').toLowerCase(); 

                    switch (activity) {
                        case '모션학습':
                            system.startActivity('tutorialActivity');
                            break;

                        case '일정':
                        case '달력':
                            system.startActivity('calendarActivity');
                            break;

                        case '뉴스':
                        case 'news':
                            system.startActivity('newsActivity');
                            break;

                        case '날씨':
                            system.startActivity('weatherActivity');
                            break;

                        case '유튜브':
                        case '유투브':
                        case 'youtube':
                            system.startActivity('youtubeActivity');
                            break;

                        case '카메라':
                        case '사진기':
                        case 'camera':
                            system.startActivity('cameraActivity');
                            break;

                        case '시계':
                        case 'clock':
                            system.startActivity('clockActivity');
                            break;

                        default: 
                            speechUtterance.speak(matches[1] + ' 어플은 존재하지 않습니다.');
                            break;
                    }
                }
            );
        })();
    }
    
    return {
        
        id : 'homeActivity',
        title : '홈 화면',
        icon : 'ic_home.png',
        layoutHTML : 'activity_home.html',
        
        init : function () {
            console.log('home init');
            
            system.attachWidget('notifyWidget');
            system.attachWidget('clockWidget');
            system.attachWidget('menuWidget');
            system.attachWidget('skeletonWidget');
            system.attachWidget('transcriptWidget');
            system.attachWidget('weatherWidget');
            
            registExecCommand();
            registWikiCommand();
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