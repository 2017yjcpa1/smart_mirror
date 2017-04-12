define([ 
    'jquery',
    'system' 
], function ($, system) {
    
    function createMenu(activity) {
        $('<li>' +
            '<img src="res/drawable/' + activity.icon + '"/>' +
            '<span>' +
                activity.title +
            '</span>' +
        '</li>')
            .appendTo('#menuWidget ul')
            .click(function () {
                system.startActivity(activity.id);
            });
    }
    
    // +드래그
    // +포커싱
    
    function show() {
        
    }
    
    function hide() {
        
    }
    
    
    
    var moveEvent = null;

    // 마우스 누르면 이벤트장착
    function mousePress(event) {
        event.preventDefault();
        event.stopPropagation();

        moveEvent = event;

        $(document)
            .bind('mousemove', mouseMove)
            .bind('mouseup', mouseRelease)
    }

    // 마우스 떼면 이벤트해제
    function mouseRelease(event) {
        event.preventDefault();
        event.stopPropagation();
        
        $(document)
            .unbind('mousemove', mouseMove)
            .unbind('mouseup', mouseRelease)
    }

    function mouseMove(event) {
        //var left = parseInt(element.style.left, 10) || 0; // 젤첨엔 포지션값이 없을거라... 대체값 0 추가
        var top = parseInt($('#menuWidget').offset().top, 10) || 0; // 젤첨엔 포지션값이 없을거라... 대체값 0 추가

        // ((현재이벤트 - 이전이벤트) = 움직인거리)
        //var moveX = event.pageX - moveEvent.pageX;
        var moveY = event.pageY - moveEvent.pageY;

        // 움직인거리 + 현재엘리멘트 위치에 더함
        //element.style.left = (left + moveX) + 'px'; 
        $('#menuWidget').css('top', (top + moveY) +'px');

        moveEvent = event;
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
        .css('position', 'absolute')
        .bind('mousedown', mousePress)

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