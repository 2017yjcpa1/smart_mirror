define([ 
    'jquery',
    'system' 
], function ($, system) {
    
    $(document).on('click', '#menuWidget li', function () {
        var activityId = $(this).data('id');
        
        system.startActivity(activityId);
    })
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_menu.html',
        
        /**
         * 위젯을 생성하였을때 초기화 작업하는 이벤트
         * 
         * @return {undefined}
         */
        init : function () {
            console.log('menu init');

            var activities = [
                'activity/homeActivity',
                'activity/calendarActivity',
                'activity/newsActivity',
                'activity/weatherActivity',
                'activity/youtubeActivity',
            ];
            
            require(activities, function () {
                
                for(var n = 0; n < arguments.length; ++n) {
                    
                    $([
                        '<li>',
                            '<img src="res/drawable/', arguments[n].icon, '"/>',
                            '<span>', 
                                arguments[n].title, 
                            '</span>',
                        '</li>'
                    ].join(''))
                        .data('id', arguments[n].id)
                        .appendTo('#menuWidget ul')
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