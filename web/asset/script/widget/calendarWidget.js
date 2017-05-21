define([
    'jquery',
    'system',
], function ($, system) {

    var real_event = new Array();

    function bringData() {
        var event = new Object();
        var event_array = new Array();
        var good;
        $.ajax({//  캘린더 데이터 불러오기
            type: 'post',
            url: '/smart_mirror/web/php/eventsdata_process.php',
            success: function (data) {
                good = JSON.parse(data);
                var q = 0;


                for (; q < good.length; q++) {
                    event.year = parseInt(good[q].start.substring(0, 4));
                    event.month = parseInt(good[q].start.substring(5, 7)) - 1;
                    event.day = parseInt(good[q].start.substring(8, 10));
                    event.hour = parseInt(good[q].start.substring(11, 13));
                    event.title = good[q].title;
                    event_array[q] = JSON.stringify(event);
                    real_event[q] = JSON.parse(event_array[q]);
                }

                var date = new Date();
                var title="";
                var i = 0;
                for (; i < real_event.length; i++) {
                    if (date.getFullYear() == real_event[i].year && 
                        date.getMonth() == real_event[i].month && 
                        date.getDate() == real_event[i].day) {
                        title += '<tr><td>'+real_event[i].title+"  "+real_event[i].hour+'시' + '</td><tr/>';
                    }
                }
                $(".todaySchedule").html(title);
            }
        })


    }

    return {

        layoutHTML: 'widget_calendar.html',

        init: function () {
            bringData();
        },

        blur: function () {

        },

        focus: function () {

        }
    }
})