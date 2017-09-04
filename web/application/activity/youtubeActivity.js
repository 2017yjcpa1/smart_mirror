define([
    'system',
    
    'input/speechRecog',
    
    'lib/youtube-1.0', 
    
    'jquery',
    'jquery-draggable'
], function (system, speechRecog, youtube, $) {
    
    var isDrag = false;
    
    function setThumbnailHeightByAspectRatio() {
        var activity = $('#youtubeActivity');
        
        var outerWidth = $('.resultItemView i', activity).outerWidth();
        var outerHeight = Math.round((outerWidth / 16) * 9);
        
        $('.resultItemView i', activity).height(outerHeight);
    }
    
    function resultItemView(data) {
        var activity = $('#youtubeActivity');
        
        $('.resultItemView h1', activity).text(data.title);
        $('.resultItemView p', activity).text(data.desc);
        $('.resultItemView i', activity).css('background-image', 'url(' + data.thumb + ')');
        
        setThumbnailHeightByAspectRatio();
    }
    
    function onHoverListItem() {
        var index = $(this).index();
        
        selectItem(index);
    }
    
    function onClickListItem() {
        var contents = $(this).data('contents');
        
        var youtubeWidget = system.getWidget('youtubeWidget');
        
        if (youtubeWidget == null) {
            return;
        } 
        
        if ( ! isDrag) {
            youtubeWidget.playVideo(contents.id);
        }
                
        isDrag = false;
    }
    
    function selectItem(index) {
        var activity = $('#youtubeActivity');
        var selectItem = $('.queryResult li', activity).eq(index);
        var contents = selectItem.data('contents');
        
        $('.queryResult li', activity).removeClass('selected');
        selectItem.addClass('selected');
        
        resultItemView(contents);
    }
    
    function queryResult(data) {
        var activity = $('#youtubeActivity');
        
        $('.queryResult', activity).show();
        $('.queryResult ul', activity).css('left', 0).empty();
        
        for (var n = 0; n < data.items.length; ++n) {
            
            var contents = data.items[n];
            
            $([
                '<li>',
                    '<h1>', contents.title, '</h1>',
                    '<img src="', contents.thumb, '">',
                '</li>'
            ].join(''))
                .data('contents', contents)
                .hover(onHoverListItem)
                .click(onClickListItem)
                .appendTo('#youtubeActivity .queryResult ul');
        }
        
        selectItem(0);
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

        speechRecog.addEventListener(
            '^(.+?)(' + SUFFIX.join('|') + ')', 
            function (isFinal, transcript, matches) {

                if ( ! system.isForegroundActivity('youtubeActivity')) {
                    return false;
                }

                if ( ! isFinal) {
                    return false;
                }

                var activity = $('#youtubeActivity');

                $('.queryForm input[type="search"]', activity).val(matches[1]);
                $('.queryForm', activity).submit();

                return true;
            }
        )
    }
    
    function registPlayCommand() {
        speechRecog.addEventListener(
            '선택.*?(실행|켜|재생|틀어)', 
            function (isFinal, transcript, matches) {

                if ( ! system.isForegroundActivity('youtubeActivity')) {
                    return false;
                }

                if ( ! isFinal) {
                    return false;
                }

                var selectItem = $('.queryResult li.selected');
                var contents = selectItem.data('contents');
                
                var youtubeWidget = system.getWidget('youtubeWidget');
                if (youtubeWidget == null) {
                    return false;
                } 

                youtubeWidget.playVideo(contents.id);
                
                return true;
            }
        )
    }
    
    function registCommand() {
        speechRecog.addEventListener(
            '(다음|오른쪽으로)', 
            function (isFinal, transcript, matches) {

                if ( ! system.isForegroundActivity('youtubeActivity')) {
                    return false;
                }

                if ( ! isFinal) {
                    return false;
                }

                var nextIndex = $('.queryResult li.selected').next().index();
                
                selectItem(nextIndex);
                
                return true;
            }
        );

        speechRecog.addEventListener(
            '(이전|왼쪽으로)', 
            function (isFinal, transcript, matches) {

                if ( ! system.isForegroundActivity('youtubeActivity')) {
                    return false;
                }

                if ( ! isFinal) {
                    return false;
                }

                var prevIndex = $('.queryResult li.selected').prev().index();
                
                selectItem(prevIndex);
                
                return true;
            }
        )
    }
    
    function __init__() {
        var activity = $('#youtubeActivity');
        
        $('.queryResult ul', activity)
            .on('dragend', function () { isDrag = true; })
            .draggable({ axis : 'x' });

        $('.queryForm', activity)
            .center()
            .submit(function (event) {
                event.preventDefault();
                event.stopPropagation();
            
                $(this)
                    .fadeOut(
                        1000,
                        function () {
                            var query = $('.queryForm input[type="search"]', activity).val();
                            
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
            registPlayCommand();
            registCommand();
            
            system.attachWidget('youtubeWidget');
        },
        
        resume: function () {
            console.log('youtube resume');
            
            var activity = $('#youtubeActivity');
                                 
            $('.queryResult', activity).hide(); 
            $('.queryForm input[type="search"]', activity).val('');
            $('.queryForm', activity).show();
        },
        
        pause: function () {
            console.log('youtube pause');
        },
        
        destroy: function () {
            console.log('youtube destroy');
        },
    };
});
