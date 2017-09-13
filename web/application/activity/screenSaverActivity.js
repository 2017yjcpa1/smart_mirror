define([
    'system', 
    'jquery',
    'input/speechRecog',
], function (system, $, speechRecog) {

    var intervalId = null;

    var captureEvents = [
        'mousemove', 
        'mouseup',
        'mousedown'
    ].join(' ');
    
    function wakeup() { 
        //system.finishActivity('screenSaverActivity');
        system.startActivity('homeActivity');

        $(document).unbind(captureEvents, wakeup);
    }

    return {

        id: 'screenSaverActivity',
        title: '화면보호기',
        icon: '',
        layoutHTML: 'activity_screen_saver.html',
 
        init: function () {
            console.log('screensaver init');
            
            speechRecog.addEventListener('.+', function () {
                system.startActivity('homeActivity');

                $(document).unbind(captureEvents, wakeup);
                
                return false;
            });
        },

        resume: function () {
            console.log('screensaver resume');
            
            if (intervalId) {
                window.clearInterval(intervalId);
            }
            
            intervalId = window.setInterval(
                             function () {
                                 $('#screenSaverActivity li:last-child')
                                     .fadeOut(function () {
                                         $(this)
                                             .detach()
                                             .show()
                                             .prependTo("#screenSaverActivity ul");
                                     });
                             }, 
                             1000 * 3
                         );
                 
                 
            $(document).bind(captureEvents, wakeup);
        },

        pause: function () {
            console.log('screensaver pause');
             
            if (intervalId) {
                window.clearInterval(intervalId);
            }
            
            system.scheduleScreenSaver();
        },

        destroy: function () {
            console.log('screensaver destroy');
        },
    }
})
