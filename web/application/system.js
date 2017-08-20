define([
    'jquery',
    
    'input/kinectCursor',
    'input/speechRecog',
], function ($, kinectCursor, speechRecog) {
    
    var activities = new Array();
    var isLock = false;
    
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
        if (n < 0) {
            return;
        }
        
        this.splice(n, 1);
    }
    
    function startActivity(activityId, data, doNotShowEffect) {
        if (isLock) {
            return false;
        }
        
        if (activities.length > 0 && activities.peek().id === activityId) {
            return false;
        }
        
        isLock = true;
        
        var isCreated = require.defined('activity/' + activityId);
        
        require(['activity/' + activityId], function (activity) {
            isCreated = isCreated && $(activity.rootLayout).length > 0;
            
            var layoutLoaded = function () {
                var rootLayout = $(activity.rootLayout);
                if ( ! isCreated) {
                    rootLayout.appendTo('body');
                    
                    if (typeof(activity.init) === 'function') {
                        activity.init();
                    }
                }
                
                $('.activity').removeClass('showEffect hideEffect activityOnTop')
                
                if ( ! doNotShowEffect) {
                    rootLayout.addClass('showEffect');
                }
                
                rootLayout.addClass('activityOnTop');

                if (typeof(activity.resume) === 'function') {
                   activity.resume(data);
                } 
                
                if (activities.length > 0) {
                    var parentActivity = activities.peek();
                    if (typeof(parentActivity.pause) === 'function') {
                        parentActivity.pause();
                    }

                    $(parentActivity.rootLayout).addClass('hideEffect')

                    activity.parentActivity = parentActivity;
                }

                activities.push(activity);
                
                isLock = false;
            }
            
            if ( ! isCreated) {
                var rootLayout = $(document.createElement('div'))
                                        .addClass('activity')
                                        .load('asset/layout/' + activity.layoutHTML + '?bust=' + new Date().getTime(), layoutLoaded)
                                        .attr('id', activityId);
                    
                activity.rootLayout = rootLayout[0];    
                return;
            }
            
            activities.remove(activityId);
            layoutLoaded();
        });
        
        return true;
    }
    
    function finishActivity(activityId) {
        if (typeof(activityId) === 'undefined' && activities.length > 1) {
            activityId = activities.peek().id;
        }
        
        if (activityId === 'homeActivity') {
            throw new Error('홈 화면은 닫을 수 없습니다.');
        }
        
        if ( ! require.defined('activity/' + activityId)) {
            throw new Error(activityId + ' 이 실행되어 있지않음');
        }
        
        require(['activity/' + activityId], function (activity) {
            var parentActivity = activity.parentActivity;
            if (parentActivity) {
                $(parentActivity.rootLayout).addClass('activityOnTop');
                
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
            return false;
        }
        
        require(['widget/' + widgetId], function (widget) {
            var rootLayout = $(document.createElement('div'))
                                    .addClass('widget')
                                    .attr('id', widgetId);
                            
            var layoutLoaded = function () {
                if (widget.alwaysOnTop === true) {
                    rootLayout.appendTo('body');
                } else {
                    var homeActivity = activities[ activities.indexOf('homeActivity') ];
                            
                    rootLayout.appendTo(homeActivity.rootLayout);
                }

                rootLayout.css('z-index', 5000);

                widget.id = widgetId;
                widget.rootLayout = rootLayout[0]; 

                if (typeof(widget.init) === 'function') {
                    widget.init();
                }
            };
            
            rootLayout.load('asset/layout/' + widget.layoutHTML + '?bust' + new Date().getTime(), layoutLoaded);      
        });
        
        return true;
    }
    
    function getWidget(widgetId) { 
        if ( ! require.defined('widget/' + widgetId)) {
            return false;
        }
        
        return require('widget/' + widgetId);
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

        getWidget : getWidget,
        
        scheduleScreenSaver : function () {
            var timeoutId = null;
         
            $(document).on('mouseover mouseout mousemove mouseup mousedown click', function () {
               
                if (timeoutId) {
                    window.clearTimeout(timeoutId);
                }
               
                timeoutId = window.setTimeout(function () {
                    startActivity('screensaverActivity'); 
                }, 2000); 
            });  
        },

        init : function () {
            kinectCursor.start();
            speechRecog.start();
            
            startActivity('homeActivity', null, true);
            
            this.scheduleScreenSaver();
        }
    };
});