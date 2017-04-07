define(['jquery'], function ($) {
    
    var activities = new Array();
    
    activities.indexOf = function (activityId) {
        for (var n = 0; n < this.length; ++n) {
            if (this[n].id === activityId) {
                return n;
            }
        }
        
        return -1;
    }
    
    activities.contains = function (activityId) {
        return this.indexOf(activityId) !== -1;
    }
    
    activities.remove = function (activityId) {
        var n = this.indexOf(activityId);
        
        this.splice(n, 1);
    }
    
    function startActivity(activityId, data) {
        if (activities.length > 0 && activities[activities.length - 1].id === activityId) {
            return;
        }
        
        var isRunning = require.defined('activity/' + activityId);
        
        require(['activity/' + activityId], function (activity) {            
            if ( ! isRunning) {
                var rootLayout = $(document.createElement('div'))
                                        .load('res/layout/' + activity.layoutHTML)
                                        .appendTo('body');
                    
                activity.id = activityId;
                activity.rootLayout = rootLayout[0]; 
                
                activity.init();
            } else {
                activities.remove(activityId);
            }
            
            $(activity.rootLayout).css('z-index', 9999);
            
            activity.resume(data);
            
            if (activities.length > 0) {
                var parentActivity = activities[activities.length - 1];
                parentActivity.pause();
            
                $(parentActivity.rootLayout).css('z-index', -1);
                
                activity.parentActivity = parentActivity;
            }
            
            activities.push(activity);
        });
    }
    
    function finishActivity(activityId) {
        // 액티비티 resume
        // z-index 정리
        // 부모, 자식 액티비티연결 정리

        if (typeof(activityId) === 'undefined' && activities.length > 1) {
            activityId = activities[ activities.length - 1 ].id;
        }
        
        if ( ! require.defined('activity/' + activityId)) {
            throw new Error(activityId + ' 이 실행되어 있지않음');
        }
        
        require(['activity/' + activityId], function (activity) {
            var parentActivity = activity.parentActivity;
            if (parentActivity) {
                $(parentActivity.rootLayout).css('z-index', 9999);
                
                parentActivity.resume();
            }
            
            activity.pause(); 
            $(activity.rootLayout).remove();
            
            require.undef(activityId);
            
            activity.destroy();
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