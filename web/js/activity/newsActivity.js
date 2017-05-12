define(['system', 'jquery'], function (system, $) {

    return {

        id: 'newsActivity',
        title: '뉴스',
        icon: 'ic_news.png',
        layoutHTML: 'activity_news.html',

        init: function () {
            console.log('news init');
        },

        resume: function () {
            console.log('news resume');

            $('#newsActivity ul').empty();


            $.ajax({
                url: 'php/News_action.php',
                data: {data: "실시간"},
                type: "GET",
                success: function (data) {
                    $('#newsActivity h1 a').html(data.items[0].title);
                    $('#newsActivity h1 a').attr("href", data.items[0].link);
                    $('#newsActivity #hotimg').css('background-image', 'url(' + data.items[0].image + ')');

                    for (var n = 1; n < 8; ++n) {
                        var a = $('<li></li>').appendTo('#newsActivity ul');
                        $('<a></a>').attr("href", data.items[n].link).attr('target', '_blank').html(data.items[n].title).appendTo(a);
                    }

                }
            })

            $(document).ready(function () {
                $("#RealTime").click(function () {
                    if ($("#hot").is(":visible")) {
                        $("#hot").slideUp();
                    } else {
                        $("#hot").slideDown();
                    }
                });
            });


        },

        pause: function () {
            console.log('news pause');
        },

        destroy: function () {
            console.log('news destroy');
        },
    }
})