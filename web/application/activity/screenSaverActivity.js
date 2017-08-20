define(['system', 'jquery'], function (system, $) {

    var intervalId = null;

    return {

        id: 'screenSaverActivity',
        title: '화면보호기',
        icon: '',
        layoutHTML: 'activity_screen_saver.html',
 
        init: function () {
            console.log('screensaver init'); 
        },

        resume: function () {
            console.log('screensaver resume');
            
            if (intervalId) {
                window.clearInterval(intervalId);
            }
            
            intervalId = window.setInterval(function () {
                $('#screenSaverActivity li:first-child')
                    .detach()
                    .appendTo("#screenSaverActivity ul"); 
            }, 1000);
        },

        pause: function () {
            console.log('screensaver pause');
             
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        },

        destroy: function () {
            console.log('screensaver destroy');
        },
    }
})
