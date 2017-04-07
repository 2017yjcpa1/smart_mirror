define([ 'system' ],function (system) {
    
    return {
        
        title : '홈화면',
        icon : 'ic_home.png',
        layoutHTML : 'home.html',
        
        init : function () {
            system.attachWidget('activities');
        },
        
        resume : function () {
            console.log('home resume');
        },
        
        pause : function () {
            console.log('home pause');
        },
        
        destroy : function () {
            console.log('home destroy');
        },
    }
})