define([ 
    'jquery',
    'system',
    
    
    'jquery-draggable',
], function ($, system) {
    
    function createMenu(activity) {
        $('<li>' +
            '<img src="res/drawable/' + activity.icon + '"/>' +
            '<span>' +
                activity.title +
            '</span>' +
        '</li>')
            .appendTo('#menuWidget ul')
            .click(function (event) {
                system.startActivity(activity.id); 
            });
    }
    
    // +드래그
    // +포커싱
    
    function show() {
        
    }
    
    function hide() {
        
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
            
            $('#menuWidget').draggable({ axis: 'y' });
            
            require([
                'activity/homeActivity',
                'activity/calendarActivity',
                'activity/newsActivity',
                'activity/weatherActivity',
                'activity/youtubeActivity',
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