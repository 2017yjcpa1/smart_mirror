define([
    'jquery',
    
    'input/kinectCursor',
    'input/speechRecog',
], function ($, kinectCursor, speechRecog) {
    
    var activities = new Array();
    
    activities.indexOf = function (id) {
        for (var n = 0; n < this.length; ++n) {
            if (this[n].id === id) {
                return n;
            }
        }
        
        return -1;
    }
    
    activities.contains = function (id) {
        return this.indexOf(id) !== -1;
    }
    
    activities.remove = function (id) {
        var n = this.indexOf(id);
        
        this.splice(n, 1);
    }
    
    function startActivity(activityId, data) {
        if (activities.length > 0 && activities[activities.length - 1].id === activityId) {
            return;
        }
        
        var isCreated = require.defined('activity/' + activityId);
        
        require(['activity/' + activityId], function (activity) {
            
            var layoutLoaded = function () {
                var rootLayout = $(activity.rootLayout);
                if ( ! isCreated) {
                    rootLayout.appendTo('body');
                    
                    if (typeof(activity.init) === 'function') {
                        activity.init();
                    }
                }
                
                rootLayout.css('z-index', 1000);

                if (typeof(activity.resume) === 'function') {
                   activity.resume(data);
                }

                if (activities.length > 0) {
                    var parentActivity = activities[activities.length - 1];
                    if (typeof(parentActivity.pause) === 'function') {
                        parentActivity.pause();
                    }

                    $(parentActivity.rootLayout).css('z-index', -1);

                    activity.parentActivity = parentActivity;
                }

                activities.push(activity);
            }
            
            if ( ! isCreated) {
                var rootLayout = $(document.createElement('div'))
                                        .addClass('activity')
                                        .load('res/layout/' + activity.layoutHTML, layoutLoaded)
                                        .attr('id', activityId);
                    
                activity.id = activityId;
                activity.rootLayout = rootLayout[0];    
                return;
            }
            
            activities.remove(activityId);
        });
    }
    
    function finishActivity(activityId) {
        if (typeof(activityId) === 'undefined' && activities.length > 1) {
            activityId = activities[ activities.length - 1 ].id;
        }
        
        if (activityId === 'home') {
            throw new Error('홈 화면은 닫을 수 없습니다.');
        }
        
        if ( ! require.defined('activity/' + activityId)) {
            throw new Error(activityId + ' 이 실행되어 있지않음');
        }
        
        require(['activity/' + activityId], function (activity) {
            var parentActivity = activity.parentActivity;
            if (parentActivity) {
                $(parentActivity.rootLayout).css('z-index', 1000);
                
                if (typeof(parentActivity.resume) === 'function') {
                    parentActivity.resume();
                }
            }
            
            if (typeof(activity.pause) === 'function') {
                activity.pause(); 
            }
            
            $(activity.rootLayout).remove();
            
            require.undef(activityId);
            
            if (typeof(activity.destroy) === 'function') {
                activity.destroy();
            }
        });
    }
    
    function attachWidget(widgetId) {
        if (require.defined('widget/' + widgetId)) {
            return;
        }
        
        require(['widget/' + widgetId], function (widget) {
            var rootLayout = $(document.createElement('div'))
                                    .addClass('widget')
                                    .attr('id', widgetId);
                            
            var layoutLoaded = function () {
                if (widget.alwaysOnTop === true) {
                    rootLayout.appendTo('body');
                } else {
                    var homeActivity = activities[ activities.indexOf('home') ];

                    rootLayout.appendTo(homeActivity.rootLayout);
                }

                rootLayout.css('z-index', 5000);

                widget.id = widgetId;
                widget.rootLayout = rootLayout[0]; 

                if (typeof(widget.init) === 'function') {
                    widget.init();
                }

                updateWidget(widgetId);
            };
            
            rootLayout.load('res/layout/' + widget.layoutHTML, layoutLoaded);      
        });
    }
    
    function updateWidget(widgetId) {
        if ( ! require.defined('widget/' + widgetId)) {
            throw new Error(widgetId + ' 을 찾을수 없습니다.');
        }
        
        require(['widget/' + widgetId], function (widget) {
            
            if (typeof(widget.update) === 'function') {
                widget.update(); 
            }
        });
    }
    
    return {
        
        /**
         * 액티비티를 시작하기위한 함수
         */
        startActivity : startActivity,
        
        /**
         * 액티비티를 종료하기위한 함수
         */
        finishActivity : finishActivity,
        
        attachWidget : attachWidget,
        
        /**
         * 외부에서 위젯을 업데이트 하기위한 함수
         */
        updateWidget : updateWidget,
        
        init : function () {
            kinectCursor.init();
            speechRecog.init();
            
            startActivity('homeActivity');
        }
    };
});