define([
    'system',
    
    'input/speechRecog',
    
    'lib/youtube-1.0', 
    
    'jquery',
    'jquery-draggable'
], function (system, speechRecog, youtube, $) {
    
    function queryResult(data) {
        var activity = $('#youtubeActivity');
        
        $(activity).addClass('queryResult');
        
        var header = data.items[0];
        
        $('i', activity).css('background-image', 'url(' + header.thumbnail + ')');
        $('h1', activity).text(header.title);
        $('p', activity).text(header.description);
        
        $('ul', activity).empty();
        
        for (var n = 0; n < data.items.length; ++n) {
            
            var contents = data.items[n];
            
            $([
                '<li>',
                    '<h1>', contents.title, '</h1>',
                    '<img src="', contents.thumbnail, '">',
                '</li>'
            ].join(''))
                .appendTo('#youtubeActivity ul');
        }
    }
    
    function registSearchCommand() {
        var SUFFIX = [
            '찾아줘',
            '찾아봐',
            '찾아',
            '검색해줘',
            '검색해',
            '검색',
        ];

        var activity = $('#youtubeActivity');

        return (function () {
            
            speechRecog.addEventListener(
                '^(.*?)(' + SUFFIX.join('|') + ')', 
                function (isFinal, transcript, matches) {

                    if ( ! system.isForegroundActivity('youtubeActivity')) {
                        return false;
                    }

                    if ( ! isFinal) {
                        return false;
                    }

                    $('input[type="search"]', activity).val(matches[1]);
                    $('form', activity).submit();

                    return true;
                }
            )
        })();
    }
    
    function __init__() {
        var activity = $('#youtubeActivity');
        
        // 16:9 사이즈 계산하여로 가로폭 기준으로 높이를 계산
        var outerWidth = $('#youtubeActivity > i').outerWidth();
        var outerHeight = Math.round((outerWidth / 16) * 9);

        $('i', activity).css('height', outerHeight);

        $('form', activity)
            .center()
            .submit(function (event) {
                event.preventDefault();
                event.stopPropagation();
            
                $(this)
                    .fadeOut(
                        1000,
                        function () {
                            var query = $('input[type="search"]', activity).val();
                            
                            youtube(query, queryResult);
                        }
                    )
            });
    }
 
    return {
        
        id: 'youtubeActivity',
        title: '유튜브',
        icon: 'ic_youtube.png',
        layoutHTML: 'activity_youtube.html',
        
        init: function () {
            console.log('youtube init');
            
            __init__();
            
            registSearchCommand();
        },
        
        resume: function () {
            console.log('youtube resume');
            
            var activity = $('#youtubeActivity');
                                 
            $(activity).removeClass('queryResult');
            
            $('input[type="search"]', activity).val('');
            $('form', activity).show();
        },
        
        pause: function () {
            console.log('youtube pause');
        },
        
        destroy: function () {
            console.log('youtube destroy');
        },
    };
});
