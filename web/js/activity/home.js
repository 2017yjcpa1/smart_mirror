define([ 'application' ],function (application) {
    
    return {
        
        title : '홈화면',
        icon : 'ic_home.png',
        layoutHTML : 'home.html',
        
        init : function () {
            console.log('home init');
        },
        
        resume : function () {
            console.log('home resume');
            application.startActivity('clock');
            
            window.setTimeout(function () {
                application.finishActivity('clock');
            }, 1000 * 5);
        },
        
        pause : function () {
            console.log('home pause');
        },
        
        destroy : function () {
            console.log('home destroy');
        },
    }
})