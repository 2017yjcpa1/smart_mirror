define([
    'jquery',
    
    'input/speechRecog',
    'lib/youtube-1.0',
], function ($, speechRecog, youtube) { 
    
    // https://developers.google.com/youtube/iframe_api_reference?hl=ko
    
    function registResizeCommand() {
        var PREFIX = [ '영상', '비디오', '유튜브', '유투브' ];
        var MAKE_SMALL_SUFFIX = [ '작게', '축소' ];
        var MAKE_LARGE_SUFFIX = [ '크게', '확대' ];
         
        speechRecog.addEventListener(
            '^(' + PREFIX.join('|') + ')(.+?)(' + MAKE_SMALL_SUFFIX.join('|') + ')', 
            function (isFinal, transcript, matches) {
                console.log(isFinal, transcript, matches[1]);
            }
        );

        speechRecog.addEventListener(
            '^(' + PREFIX.join('|') + ')(.+?)(' + MAKE_LARGE_SUFFIX.join('|') + ')', 
            function (isFinal, transcript, matches) {
                console.log(isFinal, transcript, matches[1]);
            }
        );
    }
    
    var player;
    var isYoutubeAPIReady = false;
      
    function stopVideo() {
        player.stopVideo();
    }
    
    function onPlayerReady() {
        player.playVideo();
    }
    
    function onPlayerStateChange() {
        
    }
    
    function createPlayer(id) {
        return new YT.Player('youtubePlayer', {
            height: '100%',
            width: '100%',
            videoId: id,
            
            playerVars: { 
                modestbranding : 1, // 유튜브 로고가 보여지지 않음
                autoplay : 1, // 자동재생
                loop : 1, // 반복재생
                rel : 0, // 종료시 관련동영상 출력안되게
                controls : 0, // 컨트롤바를 없앰
                showinfo : 0, // 동영상 정보를 출력하지않음
            },
            
            events: {
                onReady : onPlayerReady,
                onStateChange : onPlayerStateChange
            }
        });
    }
      
    window.onYouTubeIframeAPIReady = function () {
        isYoutubeAPIReady = true;
        player = createPlayer('M7lc1UVf-VE');
    };
    
    return {
        
        alwaysOnTop : true,
        layoutHTML: 'widget_youtube.html',
        
        play : function (id) {
            player = createPlayer(id);
        },
        
        init: function () {
            registResizeCommand();
    
            require(['https://www.youtube.com/iframe_api']);
        },
    }
})