define([ 'system' ],function (system) {
    
    return {
        
        title : '달력',
        icon : 'ic_sample.png',
        layoutHTML : 'activity_calendar.html',
        
        init : function () {
            console.log('calendar init');
        },
        
        resume : function () {
            console.log('calendar resume');
        },
        
        pause : function () {
            console.log('calendar pause');
        },
        
        destroy : function () {
            console.log('calendar destroy');
        },
    }
})