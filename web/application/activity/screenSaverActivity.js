define(['system', 'jquery'], function (system, $) {

    var intervalId = null;

    return {

        id: 'screensaverActivity',
        title: '화면보호기',
        icon: '',
        layoutHTML: 'activity_screensaver.html',

        init: function () {
            console.log('screensaver init'); 
        },

        resume: function () {
            console.log('screensaver resume');
            
            if (intervalId) {
                window.clearInterval(intervalId);
            }
            
            intervalId = window.setInterval(function () {
                $('#screensaverActivity li:first-child').detach().appendTo("#screensaverActivity ul"); 
            }, 1000);
            
            $(document).bind('mouseover mouseout mousemove mouseup mousedown click', function () { 
                system.startActivity('homeActivity'); 
                
                $(this).unbind('mouseover mouseout mousemove mouseup mousedown click', arguments.callee)
            });  
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
