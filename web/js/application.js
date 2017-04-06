define(['jquery'], function ($) {
    
    var activities = [];
    
    /*
     * 1. 액티비티 스택
     * 2. 부모, 자식 액티비티연결
     * 3. z-index 갱신
     * 4. startActivityForResult 구현
     */
    function startActivity(activityId, data) {
        var isRunning = require.defined('activity/' + activityId);
        
        require(['activity/' + activityId], function (activity) {
            
            if ( ! isRunning) {
                var rootLayout = $(document.createElement('div'))
                                        .load('res/layout/' + activity.layoutHTML)
                                        .appendTo('body')
                                        .css('z-index', 9999);
                    
                activity.id = activityId;
                activity.rootLayout = rootLayout[0]; 
                
                activity.init();
            }
            
            activity.resume(data);
            
            activities.push(activity);
        });
    }
    
    function finishActivity(activityId) {
        if (typeof(activityId) === 'undefined' && activities.length > 1) {
            activityId = activities[ activities.length - 1 ].id;
        }
        
        if ( ! require.defined('activity/' + activityId)) {
            throw new Error(activityId + ' 이 실행되어 있지않음');
        }
        
        require(['activity/' + activityId], function (activity) {
            activity.pause();
            activity.destroy();
             
            $(activity.rootLayout).remove(); 
            
            require.undef(activityId);
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