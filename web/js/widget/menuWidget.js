define([ 
    'jquery',
    'system',
    
    'jquery-draggable',
], function ($, system) {
    
    var isDrag = false;
    var showTimeoutId = -1;
    
    function createMenu(activity) {
        $('<li>' +
            '<img src="res/drawable/' + activity.icon + '"/>' +
            '<span>' +
                activity.title +
            '</span>' +
        '</li>')
            .appendTo('#menuWidget ul')
            .click(function () {
                if ( ! isDrag && system.startActivity(activity.id)) {
                    hide();
                }
                
                isDrag = false;
            });
    }
    
    function hideAfterWhile() {
        if (showTimeoutId !== -1) {
            window.clearTimeout(showTimeoutId);
            
            showTimeoutId = -1;
        }
        
        showTimeoutId = window.setTimeout(hide, 1000 * 5);  
    }
    
    function show() {
        var windowHeight = $(window).height();
        var menuWrapper = $('#menuWidget ul');
        
        menuWrapper.css('top', windowHeight / 2 - 100 / 2);
        
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
            
            $('#menuWidget #showButton').click(show)
            
            $('#menuWidget ul')
                .on('dragstart drag', hideAfterWhile)
                .on('dragend', function () { isDrag = true; })
                .draggable({ 
                    axis: 'y',
                })
            
            require([
                'activity/homeActivity',
                'activity/calendarActivity',
                'activity/newsActivity',
                'activity/weatherActivity',
                'activity/youtubeActivity',
                'activity/mapsActivity',
                'activity/musicActivity',
                'activity/galleryActivity',
            ], function () {
                for(var n = 0; n < arguments.length; ++n) {
                    createMenu(arguments[n]);
                }
            })
        },
        
        /** 
         * 외부에서 위젯을 업데이트 했을경우 발생하는 이벤트
         * 
         * @return {undefined}
         */
        update: function () {
            console.log('menu update');
        },
    }
})