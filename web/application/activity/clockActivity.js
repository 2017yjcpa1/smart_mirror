define([ 'system', 'jquery', 'jquery-draggable' ],function (system, $) {

    return {
        
        id : 'clockActivity',
        title : '시계',
        icon : 'ic_clock.png',
        layoutHTML : 'activity_clock.html',
        
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