define([ 'system' ],function (system) {
    
    return {
        
        title : '홈화면',
        icon : 'ic_home.png',
        layoutHTML : 'activity_home.html',
        
        init : function () {
            console.log('home init');
            system._attachWidget('menu_widget');
            system._attachWidget('skeleton_widget');
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