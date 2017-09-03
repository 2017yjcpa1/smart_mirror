define([
    'system', 
     
    'jquery'
], function (system, $) {
 
    return {

        id: 'calendarActivity',
        title: '달력',
        icon: 'ic_calendar.png',
        layoutHTML: 'activity_calendar.html',

        init: function () {
            console.log('calendar init');
        },

        resume: function () {
            console.log('calendar resume');
        },

        pause: function () {
            console.log('calendar pause');
        },

        destroy: function () {
            console.log('calendar destroy');
        },
    }
})
