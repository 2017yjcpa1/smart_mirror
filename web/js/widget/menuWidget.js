define([ 
    'jquery',
    'system',
    
    'jquery-draggable',
], function ($, system) {
    
    var isDrag = false;
    
    function createMenu(activity) {
        $('<li>' +
            '<img src="res/drawable/' + activity.icon + '"/>' +
            '<span>' +
                activity.title +
            '</span>' +
        '</li>')
            .appendTo('#menuWidget ul')
            .click(function () {
                if ( ! isDrag) {
                    system.startActivity(activity.id);
                }
                
                isDrag = false;
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
            
            $('#menuWidget')
                .draggable({ 
                    axis: 'y',
                })
                .on('dragging', function () {
                    
                    var rootLayout = $('#menuWidget');
                    
                    var windowHeight = $(window).height();
                    var rootHeight = rootLayout.height();
                    var rootY = parseInt(rootLayout[0].style.top, 10) || 0;
                    
                    //console.log(windowHeight / 2);
                    //console.log(rootHeight / 2 );
                    
                    
                    var eq = (windowHeight - rootY - (100 * 5) - (250 / 2)) / 100;
                    
                    
                    eq = Math.max(eq, 0);
                    eq = Math.min(eq, $('#menuWidget li').length - 1);
                    eq = Math.round(eq);
  
                    var newSelect = $('#menuWidget li').removeClass('largeSize mediumSize').eq(eq);
                     
                    newSelect.addClass('largeSize');
                    newSelect.next().addClass('mediumSize');
                    newSelect.prev().addClass('mediumSize');
                })
                .on('dragend', function () {
                    isDrag = true;
                })
            
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