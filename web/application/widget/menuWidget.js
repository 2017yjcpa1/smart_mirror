define([ 
    'jquery',
    'system',
    
    'jquery-draggable',
], function ($, system) {
    
    //var isDrag = false;
    var timeoutId = -1;
   
    function createMenu(activity) {
        $('<li>' +
            '<img src="asset/drawable/' + activity.icon + '"/>' +
            '<span>' +
                activity.title +
            '</span>' +
        '</li>')
            .appendTo('#menuWidget ul')
            .click(function () {
                /*
                if ( ! isDrag && system.startActivity(activity.id)) {
                    hide();
                }
                
                isDrag = false;
                */
                if (system.startActivity(activity.id)) {
                    hide();
                }
            });
    }
    
    
    function hideAfterWhile() {
        if (timeoutId !== -1) {
            window.clearTimeout(timeoutId);
            
            timeoutId = -1;
        }
        
        timeoutId = window.setTimeout(hide, 1000 * 5);  
    }
   
    function show() {
        var windowHeight = $(window).height();
        var menuWrapper = $('#menuWidget ul');
        
        menuWrapper.css('top', windowHeight / 2 - menuWrapper.height() / 2);
        
        $('#menuWidget').addClass('showMenus');
        
        hideAfterWhile();
    }
    
    function hide() {        
        $('#menuWidget').removeClass('showMenus');
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_menu.html',
        
        /**
         * 위젯을 생성하였을때 초기화 작업하는 이벤트
         * 
         * @return {undefined}
         */
        init : function () {
            
            $('#menuWidget #showButton')
                .click(show)
                .on('mouseover', show)
            
            $('#menuWidget ul')
                .on('mousemove', hideAfterWhile)
            /*
            $('#menuWidget ul')
                .on('dragstart drag mousemove', hideAfterWhile)
                .on('dragend', function () { isDrag = true; })
                .draggable({ 
                    axis: 'y',
                })
            */
           
            require([
                'activity/homeActivity',
                'activity/tutorialActivity',
                'activity/calendarActivity',
                'activity/weatherActivity',
                'activity/youtubeActivity',
                'activity/cameraActivity',
                'activity/clockActivity',
            ], function () {
                for(var n = 0; n < arguments.length; ++n) {
                    createMenu(arguments[n]);
                }
            })
        }
    }
})