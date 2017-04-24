define([ 'system','jquery' ],function (system,$) {
    
    return {
        
        id : 'mapsActivity',
        title : '지도',
        icon : 'ic_maps.png',
        layoutHTML : 'activity_maps.html',
        
        init : function () {
            console.log('maps init');
        },
        
        resume : function () {
            console.log('maps resume');            
            },
        
        pause : function () {
            console.log('maps pause');
        },
        
        destroy : function () {
            console.log('maps destroy');
        },
    }
})