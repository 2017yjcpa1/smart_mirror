define([
    'system',
    
    'input/speechRecog',
    
    'jquery',
    'jquery-draggable'
], function (system, speechRecog, $) {
    
    var APIKEY = 'AIzaSyASFltS6aSwHYy6q9ft-KIH8wAB0-rEHfs';
    var SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
    
    function searchResult(data) {
        
        $('#youtubeActivity').addClass('searchResult');
        
        var header = data.items[0];
        
        $('#youtubeActivity i').css('background-image', 'url(' + header.snippet.thumbnails.high.url + ')');
        $('#youtubeActivity h1').text(header.snippet.title);
        $('#youtubeActivity p').text(header.snippet.description);
        
        $('#youtubeActivity ul').empty();
        
        for(var n = 0; n < data.items.length; ++n) {
            var contents = data.items[n];
            
            $([
                '<li>',
                    '<h1>', contents.snippet.title, '</h1>',
                    '<img src="', contents.snippet.thumbnails.high.url, '">',
                '</li>'
            ].join('')).appendTo('#youtubeActivity ul');
        }
    }
    
    function registSearchCommand() {   
        var speechSuffix = [
            '찾아줘',
            '찾아봐',
            '찾아',
            '검색해줘',
            '검색해',
            '검색',
        ];

        speechRecog.addEventListener(
            '^(.*?)(' + speechSuffix.join('|') + ')', 
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
    }
 
    return {
        
        id: 'youtubeActivity',
        title: '유튜브',
        icon: 'ic_youtube.png',
        layoutHTML: 'activity_youtube.html',
        
        init: function () {
            console.log('youtube init');
            
            var outerWidth = $('#youtubeActivity > i').outerWidth();
            var outerHeight = Math.round((outerWidth / 16) * 9); // 16:9 사이즈로 높이를 변환
            
            $('#youtubeActivity > i').css('height', outerHeight);
            
            $('#youtubeActivity input[type="search"]').center();
            
            $('#youtubeActivity form').submit(function (event) {
                event.stopPropagation();
                event.preventDefault();
               
                $('#youtubeActivity form')
                    .fadeOut(1000, function () {
                        $.get(
                            SEARCH_URL, 
                            { part: ['snippet', 'id'].join(','),
                              q: $('#youtubeActivity input[type="search"]').val(),
                              type: 'video',
                              key: APIKEY },
                            searchResult
                        );  
                    });
            });
            
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
