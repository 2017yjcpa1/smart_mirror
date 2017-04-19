define([ 'system', 'jquery' ],function (system, $) {
    
    return {
        
        id : 'newsActivity',
        title : '뉴스',
        icon : 'ic_news.png',
        layoutHTML : 'activity_news.html',
        
        init : function () {
            console.log('news init');
        },
        
        resume : function () {
            console.log('news resume');
            
            return;
            $('#newsActivity').empty();
            
            $.ajax({
                url : 'php/News_action.php',
                success : function (data) {
                    for (var n = 0; n < data.items.length; ++n) {
                        $('<div></div>').html(data.items[n].title).appendTo('#newsActivity');
                    }
                }
            })
        },
        
        pause : function () {
            console.log('news pause');
        },
        
        destroy : function () {
            console.log('news destroy');
        },
    }
})