define([ 'application' ],function (application) {
    
    return {
        
        title : '시계',
        icon : 'ic_home.png',
        layoutHTML : 'clock.html',
        
        init : function () {
            console.log('clock init');
        },
        
        resume : function () {
            console.log('clock resume');
        },
        
        pause : function () {
            console.log('clock pause');
        },
        
        destroy : function () {
            console.log('clock destroy');
        },
    }
})