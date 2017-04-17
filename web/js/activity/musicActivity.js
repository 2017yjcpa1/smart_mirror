define([ 'system' ],function (system) {
    
    return {
        
        id : 'musicActivity',
        title : '음악',
        icon : 'ic_music.png',
        layoutHTML : 'activity_music.html',
        
        init : function () {
            console.log('music init');
        },
        
        resume : function () {
            console.log('music resume');
        },
        
        pause : function () {
            console.log('music pause');
        },
        
        destroy : function () {
            console.log('music destroy');
        },
    }
})