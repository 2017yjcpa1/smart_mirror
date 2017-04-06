define(['jquery'], function ($) {
    
    var activities = [];
    
    function startActivity(activity, data) {
        var isRunning = require.defined('activity/' + activity);
        
        require(['activity/' + activity], function (activity) {
            
            if ( ! isRunning) {    
                if (typeof(activity.layoutHTML) !== 'undefined') {
                    var layoutWrapper = $(document.createElement('div'));

                    layoutWrapper.load('res/layout/' + activity.layoutHTML);
                    layoutWrapper.appendTo('body');
                }
                
                activity.init();
            }
            
            activity.resume(data);
        })
    }
    
    function finishActivity(activity) {
        if (typeof(activity) === 'undefined') {
            activity = activities[ activities.length - 1 ];
        }
        
        if ( ! require.defined('activity/' + activity)) {
            throw new Error(activity + ' 이 실행되어 있지않음');
        }
        
        require(['activity/' + activity], function (activity) {
            activity.pause();
            activity.destroy();
            
            require.undef(activity);
        });
    }
    
    return {
        
        startActivity : startActivity,
        
        finishActivity : finishActivity,
        
        init : function () {
            startActivity('home');
        }
    };
})