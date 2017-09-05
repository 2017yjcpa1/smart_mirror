define([
    'system',
    
    'jquery',
     
    'input/speechRecog',
    'output/speechUtterance',
], function (system, $, speechRecog, speechUtter) {
    
    var REGEX = '(.+?)(뭐지|뭐냐|뭐야|찾아|검색)';
    
    function init() {
        speechRecog.addEventListener(
            REGEX, 
            function (isFinal, transcript, matches) {
                
                if (system.isForegroundActivity('youtubeActivity')) {
                    return false;
                }

                if ( ! isFinal) {
                    return false;
                }

                var url = window.URL.createEndpointURL('wiki', { 'q' : matches[1] });
                var handler = function (data) {
                    if ( ! data || data.length <= 0) {
                        speechUtter.speak('적절한 답변을 찾지 못하였습니다.');
                        return;
                    }
                    
                    $('#wikiWidget').fadeIn();
                    
                    var speakEnd = function () {
                        window.setTimeout(
                            function () {
                                $('#wikiWidget').fadeOut();
                            }, 
                            1000 * 3
                        );
                    }

                    speechUtter.speak(data[0].replace(/\([^\)]+\)/gi, "")
                                             .replace(/\[[^\]]+\]/gi, "")
                                             .replace(/\{[^\}]+\}/gi, "")
                                             .replace(/『[^』]+』/gi, "")
                                             .replace(/《[^》]+》/gi, "")
                                             .replace(/「[^」]+」/gi, "")
                                             .replace(/〈[^〉]+〉/gi, ""), speakEnd);
                                     
                    $('#wikiWidget h1').text(data[0]);
                    $('#wikiWidget em').text(matches[1]);
                    $('#wikiWidget ul').empty();
                    
                    for(var n = 1; n < data.length && n <= 5; ++n) {
                        
                        $('<li></li>')
                            .text(data[n])
                            .appendTo('#wikiWidget ul');
                    }
                }

                $.getJSON(url, handler);
                return true;
            }
        );
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML: 'widget_wiki.html',
        
        init: function () {
            
            $('#wikiWidget').hide();
            
            init();
        },
    }
})