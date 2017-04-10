define([ 'system' ],function (system) {
    
    return {
        
        id : 'newsActivity',
        title : '뉴스',
        icon : 'ic_sample.png',
        layoutHTML : 'activity_news.html',
        
        init : function () {
            console.log('news init');
        },
        
        resume : function () {
            console.log('news resume');
        },
        
        pause : function () {
            console.log('news pause');
        },
        
        destroy : function () {
            console.log('news destroy');
        },
    }
})