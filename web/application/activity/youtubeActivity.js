define([
    'system',
    
    'input/speechRecog',
    
    'lib/youtube-1.0', 
    
    'jquery',
    'jquery-draggable'
], function (system, speechRecog, youtube, $) {
    
    var isDrag = false;
    
    function setThumbHeightByAspectRatio() {
        var rootLayout = $('#youtubeActivity');
        
        var outerWidth = $('.resultItemView i', rootLayout).outerWidth();
        var outerHeight = Math.round((outerWidth / 16) * 9);
        
        $('.resultItemView i', rootLayout).height(outerHeight);
    }
    
    function resultItemView(data) {
        var rootLayout = $('#youtubeActivity');
        
        $('.resultItemView h1', rootLayout).text(data.title);
        $('.resultItemView p', rootLayout).text(data.desc);
        $('.resultItemView i', rootLayout).css('background-image', 'url(' + data.thumb + ')');
        
        setThumbHeightByAspectRatio();
    }
    
    function onHoverListItem() {
        selectItem($(this));
    }
    
    function playVideo(contents) {
        if ( ! contents) {
            contents = $('.queryResult .selected').data('contents');
        }
        
        var youtubeWidget = system.getWidget('youtubeWidget');
        if (youtubeWidget == null) {
            return;
        } 
        
        youtubeWidget.playVideo(contents.id);
    }
    
    function onClickListItem() {
        var contents = $(this).data('contents');
        
        if ( ! isDrag) {
            playVideo(contents);
        }
                
        isDrag = false;
    }
    
    function selectItem(target) {
        var rootLayout = $('#youtubeActivity');
        
        var selectItem = target;
        
        if (typeof(target) == 'number') {
            selectItem = $('.queryResult li', rootLayout).eq(target);
        }
        
        var contents = selectItem.data('contents');
        
        $('.queryResult li', rootLayout).removeClass('selected');
        selectItem.addClass('selected');
        
        resultItemView(contents);
    }
    
    // TODO 네이밍 바꿔야할듯...
    function getItem(amount) {
        var rootLayout = $('#youtubeActivity');
        
        var isPrev = false;
        var selectItem = $('.queryResult li.selected', rootLayout);
        
        if (amount < 0) {
            isPrev = true;
        }
        
        amount = Math.abs(amount);
        
        for (var n = 0; n < amount; ++n) {
            if (isPrev) {
                selectItem = selectItem.prev();
            } else {
                selectItem = selectItem.next();
            }
        }
        
        return selectItem;
    }
    
    function queryResult(data) {
        var rootLayout = $('#youtubeActivity');
        
        $('.queryResult', rootLayout).show();
        $('.queryResult ul', rootLayout).css('left', 0).empty();
        
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
    
    function registCommands() {
        var REGEX_SEARCH = '(.+?)(찾아|찾어|검색)';
        var REGEX_PLAY = '(선택.*?)?(실행|켜줘|켜라|재생)';
        var REGEX_NEXT_SELECT = '(다음|오른쪽)';
        var REGEX_PREV_SELECT = '(이전|왼쪽)';
        
        var rootLayout = $('#youtubeActivity');
        
        function isValidate(isFinal) {
            if ( ! system.isForegroundActivity('youtubeActivity')) {
                return false;
            }

            if ( ! isFinal) {
                return false;
            }
            
            return true;
        }

        speechRecog.addEventListener(
            REGEX_SEARCH, 
            function (isFinal, transcript, matches) {
                if ( ! isValidate(isFinal)) {
                    return false;
                }

                $('.queryForm input[type="search"]', rootLayout).val(matches[1]);
                $('.queryForm', rootLayout).submit();

                return true;
            }
        );

        speechRecog.addEventListener(
            REGEX_PLAY, 
            function (isFinal, transcript, matches) {
                if ( ! isValidate(isFinal)) {
                    return false;
                }
                
                playVideo();
                return true;
            }
        );

        speechRecog.addEventListener(
            REGEX_NEXT_SELECT, 
            function (isFinal, transcript, matches) {
                if ( ! isValidate(isFinal)) {
                    return false;
                }
                
                var nextItem = getItem(1);
        
                $('.queryResult ul').css('left', -(nextItem.index() * nextItem.outerWidth(true)));
                
                selectItem(nextItem);
                return true;
            }
        );

        speechRecog.addEventListener(
            REGEX_PREV_SELECT, 
            function (isFinal, transcript, matches) {
                if ( ! isValidate(isFinal)) {
                    return false;
                }
                
                var prevItem = getItem(-1);
                
                $('.queryResult ul').css('left', -(prevItem.index() * prevItem.outerWidth(true)));
                
                selectItem(prevItem);
                return true;
            }
        );
    }
    
    function __init__() {
        var rootLayout = $('#youtubeActivity');
        
        $('.queryResult ul', rootLayout)
            .on('dragend', function () { isDrag = true; })
            .draggable({ axis : 'x' });

        $('.queryForm', rootLayout)
            .center()
            .submit(function (event) {
                event.preventDefault();
                event.stopPropagation();
            
                $(this)
                    .fadeOut(
                        1000,
                        function () {
                            var query = $('.queryForm input[type="search"]', rootLayout).val();
                            
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
            
            registCommands();
            
            system.attachWidget('youtubeWidget');
        },
        
        resume: function () {
            console.log('youtube resume');
            
            var rootLayout = $('#youtubeActivity');
                                 
            $('.queryResult', rootLayout).hide(); 
            $('.queryForm input[type="search"]', rootLayout).val('');
            $('.queryForm', rootLayout).show();
        },
        
        pause: function () {
            console.log('youtube pause');
        },
        
        destroy: function () {
            console.log('youtube destroy');
        },
    };
});
