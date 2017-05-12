define(['system', 'jquery'], function (system, $) {
    
    function newscurrent() {
        $.ajax({
           
            url: 'php/News_action.php',
            data: {data: "실시간"},
            type: "GET",

            success: function (data) {
                for (var n = 1; n < data.items[n].title.length; ++n) {
                    var a = $('<b></b>').appendTo('marquee');
                    $('<a></a>').attr("href", data.items[n].link).attr('target', '_blank').html(data.items[n].title).appendTo(a);
                }
            }
        })
    }

    return {
        layoutHTML: 'widget_news.html',
        init: function () {
            newscurrent();
        },
        blur: function () {

        },
        focus: function () {

        }
    }



})
