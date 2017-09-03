define([
    'system',
    
    'input/speechRecog',
    
    'lib/youtube-1.0', 
    
    'jquery',
    'jquery-draggable'
], function (system, speechRecog, youtube, $) {
    
    function searchResult(data) {
        
        $('#youtubeActivity').addClass('searchResult');
        
        var header = data.items[0];
        
        $('#youtubeActivity i').css('background-image', 'url(' + header.thumbnail + ')');
        $('#youtubeActivity h1').text(header.title);
        $('#youtubeActivity p').text(header.description);
        
        $('#youtubeActivity ul').empty();
        
        for(var n = 0; n < data.items.length; ++n) {
            var contents = data.items[n];
            
            $([
                '<li>',
                    '<h1>', contents.title, '</h1>',
                    '<img src="', contents.thumbnail, '">',
                '</li>'
            ].join('')).appendTo('#youtubeActivity ul');
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

                    $('#youtubeActivity input[type="search"]').val(matches[1]);
                    $('#youtubeActivity form').submit();

                    return true;
                }
            )
        })();
    }
    
    function __init__() {
        
        // 16:9 사이즈 계산하여로 가로폭 기준으로 높이를 계산
        var outerWidth = $('#youtubeActivity > i').outerWidth();
        var outerHeight = Math.round((outerWidth / 16) * 9);

        $('#youtubeActivity i').css('height', outerHeight);

        $('#youtubeActivity form')
            .center()
            .submit(function (event) {
                event.preventDefault();
                event.stopPropagation();
            
                $(this)
                    .fadeOut(
                        1000,
                        function () {
                            
                            var keyword = $('#youtubeActivity input[type="search"]').val();
                            
                            youtube(keyword, function (data) {
                                            searchResult(data)
                            });
                            
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
                                 
            $('#youtubeActivity').removeClass('searchResult');
            
            $('#youtubeActivity input[type="search"]').val('');
            $('#youtubeActivity form').show();
        },
        
        pause: function () {
            console.log('youtube pause');
        },
        
        destroy: function () {
            console.log('youtube destroy');
        },
    };
});
