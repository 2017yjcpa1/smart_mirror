define([ 'system' ],function (system) {
    
    return {
        
        title : '날씨',
        icon : 'ic_sample.png',
        layoutHTML : 'activity_weather.html',
        
        init : function () {
            console.log('weather init');
        },
        
        resume : function () {
            console.log('weather resume');
        },
        
        pause : function () {
            console.log('weather pause');
        },
        
        destroy : function () {
            console.log('weather destroy');
        },
    }
})