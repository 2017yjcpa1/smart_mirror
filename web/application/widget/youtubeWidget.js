define([
    'jquery',
    
    'input/speechRecog'
], function ($, speechRecog) { 
    // https://developers.google.com/youtube/iframe_api_reference?hl=ko
    
    var isReady = false;
    
    window.onYouTubeIframeAPIReady = function () {
        console.log('onYouTubeIframeAPIReady');
        
        isReady = true;
        if (videoId !== null) {
            createPlayer(videoId);
        }
    };
    
    var videoId = null;
    var player = null;
    
    function injectPlayer(videoId) {
        return new window.YT.Player('youtubePlayer', {
            
            height : '100%',
            width : '100%',
            videoId : videoId,

            playerVars : { 
                modestbranding : 1, // 유튜브 로고가 보여지지 않음
                autoplay : 1, // 자동재생
                loop : 1, // 반복재생
                rel : 0, // 종료시 관련동영상 출력안되게
                controls : 0, // 컨트롤바를 없앰
                showinfo : 0, // 동영상 정보를 출력하지않음
            },
            
            events : {
                onReady : onPlayerReady,
                onStateChange : onPlayerStateChange
            }
        });
    }
    
    function onPlayerReady() {
        $('#youtubeWidget').show();
        
        player.playVideo();
    }
    
    function onPlayerStateChange() {
        
    }
    
    function setScreenMode() {
        $('#youtubeWidget').addClass('screenMode');
    }
    
    function setWidgetMode() {
        $('#youtubeWidget').removeClass('screenMode');
    }
    
    function isScreenMode() {
        return $('#youtubeWidget').hasClass('screenMode');
    }
    
    function createPlayer(videoId) {
        if ( ! isReady) {
            return false;
        }
        
        player = injectPlayer(videoId);
        
        return player;
    }
    
    function playVideo(_videoId) {
        videoId = _videoId;
        if (isReady) {
            createPlayer(videoId);
        }
    }
    
    function stopVideo() {
        if (player !== null) {
            player.stopVideo();
        }
    }
    
    function registCommand() {
        speechRecog.addEventListener(
            [
                '(영상|비디오|유투브|유튜브)',
                '(확대|크게)',
            ].join(''), 
            function (isFinal, transcript, matches) { 

                if ( ! isFinal) {
                    return false;
                }
                
                if ( ! isReady || player == null) {
                    return false;
                }
                
                if (isScreenMode()) {
                    return false;
                }

                setScreenMode();
                return true;
            }
        );

        speechRecog.addEventListener(
            [
                '(영상|비디오|유투브|유튜브)',
                '(축소|작게)',
            ].join(''), 
            function (isFinal, transcript, matches) { 

                if ( ! isFinal) {
                    return false;
                }
                
                if ( ! isReady || player == null) {
                    return false;
                }
                
                if ( ! isScreenMode()) {
                    return false;
                }

                setWidgetMode();
                return true;
            }
        );
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML: 'widget_youtube.html',
        
        playVideo : playVideo,
        
        stopVideo : stopVideo,
        
        setScreenMode : setScreenMode,
        
        setWidgetMode : setWidgetMode,

        init: function () {
            require(['https://www.youtube.com/iframe_api']);
            
            registCommand();
        },
    }
})