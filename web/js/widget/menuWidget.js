define([ 
    'jquery',
    'system' 
], function ($, system) {
    
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
            
            require([
                'activity/homeActivity',
                'activity/calendarActivity',
                'activity/newsActivity',
                'activity/weatherActivity',
                'activity/youtubeActivity',
            ], function (homeActivity, 
                         calendarActivity, 
                         newsActivity, 
                         weatherActivity, 
                         youtubeActivity) {
                
                var activities = [
                    homeActivity,
                    calendarActivity,
                    newsActivity,
                    weatherActivity,
                    youtubeActivity
                ];
                
                $('#menuWidget ul').empty();
                
                for(var n = 0; n < activities.length; ++n) {
                    $([
                        '<li>',
                            '<img src="res/drawable/', activities[n].icon, '"/>',
                            '<span>', activities[n].title, '</span>',
                        '</li>',
                    ].join(''))
                        .appendTo('#menuWidget ul');
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