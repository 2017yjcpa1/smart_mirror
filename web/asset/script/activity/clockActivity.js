define([ 'system' ],function (system) {
    
    return {
        
        id : 'clockActivity',
        title : '시계',
        icon : 'ic_clock.png',
        layoutHTML : 'activity_clock.html',
        
        init : function () {
            console.log('clock resume');
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