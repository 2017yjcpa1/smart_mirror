define([ 'system' ],function (system) {
    
    return {
        
        id : 'youtubeActivity',
        title : '유튜브',
        icon : 'ic_youtube.png',
        layoutHTML : 'activity_youtube.html',
        
        init : function () {
            console.log('youtube init');
        },
        
        resume : function () {
            console.log('youtube resume');
        },
        
        pause : function () {
            console.log('youtube pause');
        },
        
        destroy : function () {
            console.log('youtube destroy');
        },
    }
})