define([ 
    'jquery',
    'system' 
], function ($, system) {
    
    function scrollTo(amount) {
        var menu = $(this.rootLayout);
        var windowHeight = $(window).height();
        var oldSelect = $('.largeSize', this.rootLayout);
        var menuItems = $('li', this.rootLayout);

        var newSelect = menuItems.eq((oldSelect.index(newSelect) + amount) % menuItems.length);

        menuItems.removeClass('largeSize mediumSize');

        newSelect.addClass('largeSize');
        newSelect.next().addClass('mediumSize');
        newSelect.prev().addClass('mediumSize');

        var newTop = windowHeight / 2 - 250 * (menuItems.index(newSelect) + 1) / 2;
        menu.css('top', newTop);
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
            console.log('menu init');
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