define(['system', 'jquery', 'jquery-draggable'], function (system, $) {

    return {

        id: 'calendarActivity',
        title: '달력',
        icon: 'ic_calendar.png',
        layoutHTML: 'activity_calendar.html',

        init: function () {
            console.log('calendar init');

        },

        resume: function () {
            console.log('calendar resume');

            var i = 0;
            var day_array = new Array();
            var timeline = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            var calendar_time = [24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            var korean_day=['일','월','화','수','목','금','토'];
            var am = "오전";
            var pm = '오후';
            for (; i < 24; i++) {
                var time = am + timeline[i];
                if (i >= 12) {
                    time = pm + timeline[i];
                }
                // calendar_time과 달력 일정 데이터의 시간을 맞춤 
                var str = "<tr id=at" + calendar_time[i] + ">" + "<td>" + time + 
                        "시</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("#calendar_table").append(str);
                $("#at"+calendar_time[i]).children().eq(0).css('padding-bottom','60px');
//                $("#at"+calendar_time[i]).css('border','solid 1px');
                $("#at"+calendar_time[i]).css('border-style','groove');

            }

            var d = new Date();
            var store = new Array;
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'Nobember', 'December'];

            var current_year = d.getFullYear();
            var current_month = d.getMonth();

            var year = d.getFullYear(); // 2017
            var month = d.getMonth(); // 3

            var today = d.getDate(); // 오늘 일
            var first_date = months[month] + ' 0 ' + year; // 떡밥

            var getFirstday = new Date(first_date).toString(); //Sat April 2017  , 그달의 첫번째 요일
            var total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
            var firstday = getFirstday.substring(0, 3); // 요일만 빼냄

            var day_no = days[firstday];
            //--------------------------------------월간 --------------------------


            var jan = months[0] + ' 1 ' + year; // 떡밥
            var janfirst = new Date(jan).toString(); //Sun Jan 01 2017 00:00:00 GMT+0900 (대한민국 표준시)
            var jan_firstday = janfirst.substring(0, 3); // 요일만 빼냄


            var sum = 0;
            i = 1;
            for (; i <= month; i++) { // 이번달 까지의 총 일수
                total_sofar = new Date(year, i, 0).getDate();
                sum += total_sofar;
            }
            sum = sum + today;


            var today_date = new Date(months[month] + " " + today + " " + year).toString(); // 오늘의 요일 구하는 방법, Sat April 2017
            var getday = today_date.substring(0, 3);  // Sat April 2017 에서 Sat만 빼냄

            var r = 0;


            if (getday != 'Sun') {

                while (getday != days[r]) { // 오늘이 일요일이 아니라면
                    r++;
                }
            }

            var event = new Object();
            var event_array = new Array();
            var real_event = new Array();
            $('#sync').click(function () { // 
                var p = 0;
                var i = 1;
                for (; p < 23; p++) {
                    console.log("p="+p);
                    for (; i <= 7; i++) {
                        $('#at'+p).children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
    
                    }
                    i=1;
                }
                p = 0;

                $.ajax({//  캘린더 데이터 불러오기
                    type: 'post',
                    url: '/smart_mirror/web/php/eventsdata_process.php',
                    success: function (data) {
                        var good = JSON.parse(data);
                        var q = 0;


                        for (; q < good.length; q++) {

                            event.year = parseInt(good[q].start.substring(0, 4));
                            event.month = parseInt(good[q].start.substring(5, 7)) - 1;
                            event.day = parseInt(good[q].start.substring(8, 10));
                            event.hour = parseInt(good[q].start.substring(11, 13));
                            event.min = parseInt(good[q].start.substring(15, 17));
                            event.title = good[q].title;
                            event.location=good[q].location;
                            event_array[q] = JSON.stringify(event);  
                            real_event[q] = JSON.parse(event_array[q]); 
                            console.log('rea_event:' + real_event[q]);
                        }
                        sync();
                    }
                })

            })


            var sunday = today - r; // 일요일 날짜!!!!

            if (sunday == 0) { // 이전달 
                sunday = new Date(year, month, 0).getDate();
                total = new Date(year, month, 0).getDate(); // 그달의 총 일수
                month--;
            }

            var s = sunday;
            var isbeyond = false;
            var g = 0;
            i = 0;
            z = 0;
            for (; i < 7; i++) { // 일요일부터 토요일까지 출력
                if (s > total) { // 달이 이어질때, 그 달의 총 일수 초과
                    month++;
                    s = 1;
                    isbeyond = true;
                    beyond_tmp = month; // beyond_tmp로 12~1월 제어
                    if (month == 12)
                        month = 0;
                }
//                $(".weeklyday:eq(" + i + ")").text((month + 1) + " " + s);
                str="<h2 class='h2' style='color=blue'>"+s+"</h2><h3 class='h3'>"+korean_day[i]+"</h3>";
                $(".weeklyday:eq(" + i + ")").html(str);
                if (s == today) {
                    $(".h2:eq(" + i + ")").css('color', 'skyblue');
                    $(".h3:eq(" + i + ")").css('color', 'skyblue');
                    day_array[i] = s;
                }
                for (; z < real_event.length; z++) {

                    if (year == real_event[z].year && month == real_event[z].month && s == real_event[z].day) { // 년월일이 일치하면

                        var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
                        $("#at" + real_event[z].hour).children().eq(eventday+1).text(real_event[z].title);
//                        $("#at" + real_event[z].hour).children().eq(eventday+1).html(<h3><a href=''></a></h3>real_event[z].location);
                        $("#at" + real_event[z].hour).children().eq(eventday+1).css('padding-top',real_event[z].min+"px");
                    }

                }
                s++;

            }
            if (isbeyond) {
                month = beyond_tmp;
                month--;
            } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

            $("#year-month").text(months[month] + " " + year); // 월 년


            var sync = function () {
                var tmp = month;
                year = d.getFullYear(); // 2017
                month = d.getMonth(); // 3
                var total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
                var today_date = new Date(months[month] + " " + today + " " + year).toString(); // 오늘의 요일 , Sat April 2017
                var getday = today_date.substring(0, 3); // Sat
                var r = 0;

                var p = 0;
                i = 1;
                for (; p < 23; p++) {
                    for (; i <= 7; i++) {
                        $('#at' + (p + 1)).children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
                    }
                    i=1;
                }
                p = 0;
                if (getday != 'Sun') {
                    while (getday != days[r]) { // 오늘이 일요일이 아니라면
                        r++;
                    }
                }

                sunday = today - r; // 일요일 날짜!!!!

                if (sunday == 0) {
                    sunday = new Date(year, month, 0).getDate();
                    total = new Date(year, month, 0).getDate(); // 그달의 총 일수
                    month--;
                }

                if (sunday > total) { // 다음달로 넘어갈때
                    month++;

                    if (sunday > total && months[tmp] == 'December') { //  1월로 넘어갈때
                        year++;
                        month = 0; // 1월

                    }


                    sunday = sunday - total; // 그달의 첫번째 일요일


                }

                i = 0;
                var z = 0;
                day = sunday;
                var beyond_tmp;
                var isbeyond = false;


                for (; i < 7; i++) { // 일요일부터 토요일까지 출력
                    if (day > total) { // 달이 이어질때, 그 달의 총 일수 초과
                        month++;
                        day = 1;
                        isbeyond = true;
                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
                        if (month == 12)
                            month = 0;
                    }
      
                     str="<h2 class='h2'>"+day+"</h2><h3 class='h3'>"+korean_day[i]+"</h3>";
                     $(".weeklyday:eq(" + i + ")").html(str);

                    day_array[i] = day;
                    if (day == today && current_month == month && current_year == year){
                        $(".h2:eq(" + i + ")").css('color', 'skyblue');
                        $(".h3:eq(" + i + ")").css('color', 'skyblue');
                    }    
                    
                    z = 0;
                    for (; z < real_event.length; z++) {

                        if (year == real_event[z].year && month == real_event[z].month && day == real_event[z].day) {
                            var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
                            $("#at" + real_event[z].hour).children().eq(eventday+1).text(real_event[z].title);
                            $("#at" + real_event[z].hour).children().eq(eventday+1).css('padding-top',real_event[z].min+"px");


                        }

                    }
                    day++;
                }
                if (isbeyond) {
                    month = beyond_tmp;
                    month--;
                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month").text(months[month] + " " + year); // 월 년
            }

            $('#today').click(function () {
                console.log('오늘');
                sync();

            })

            $('#right').click(function () {
                console.log('오른쪽');
                sunday = sunday + 7;
                var tmp = month;

                total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
                var p = 0;
                i = 1;
                for (; p < 23; p++) {
                    for (; i <= 7; i++) {
                        $('#at' + (p + 1)).children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
                    }
                    i=1;
                }
                p = 0;
                if (sunday > total) { // 다음달로 넘어갈때
                    month++;

                    if (sunday > total && months[tmp] == 'December') { //  1월로 넘어갈때
                        year++;
                        month = 0; // 1월

                    }


                    sunday = sunday - total; // 그달의 첫번째 일요일


                }

                i = 0;
                var z = 0;
                day = sunday;
                var beyond_tmp;
                var isbeyond = false;
                z = 0;
                for (; i < 7; i++) { // 일요일부터 토요일까지 출력
                    if (day > total) { // 달이 이어질때, 그 달의 총 일수 초과
                        month++;
                        day = 1;
                        isbeyond = true;
                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
                        if (month == 12)
                            month = 0;
                    }

                         str="<h2 class='h2'>"+day+"</h2><h3 class='h3'>"+korean_day[i]+"</h3>";
                         $(".weeklyday:eq(" + i + ")").html(str);

                    if (day == today && current_month == month && current_year == year) {
                        $(".h2:eq(" + i + ")").css('color', 'skyblue');
                        $(".h3:eq(" + i + ")").css('color', 'skyblue');
                    } else{
                        $(".h2:eq(" + i + ")").css('color', 'white');
                        $(".h3:eq(" + i + ")").css('color', 'white');
                    }
                    z = 0;
                    day_array[i] = day;
                    for (; z < real_event.length; z++) {

                        if (year == real_event[z].year && month == real_event[z].month && day == real_event[z].day) {
                            var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
                            $("#at" + real_event[z].hour).children().eq(eventday+1).text(real_event[z].title);
                            $("#at" + real_event[z].hour).children().eq(eventday+1).css('padding-top',real_event[z].min+"px");


                        }

                    }
                    day++;

                }
                if (isbeyond) {
                    month = beyond_tmp;
                    month--;
                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month").text(months[month] + " " + year); // 월 년
            })
            $('#left').click(function () {
                console.log('왼쪽');

                sunday = sunday - 7; // 일요일 날짜!!!!
                var tmp = month;
                var p = 0;
                i = 1;
                for (; p < 23; p++) {
                    for (; i <= 7; i++) {
                        $('#at' + (p + 1)).children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
                    }
                    i=1
                }
                p = 0;
                if (sunday <= 0) {
                    month--;

                    if (sunday <= 0 && months[tmp] == 'January') { // 일요일이 0이하, 1월일때
                        year--;
                        month = 11; // 12월

                    }

                    total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수

                    sunday = total + (sunday); // 그달의 마지막 일요일


                }


                i = 0;
                var z = 0;
                day = sunday;
                var beyond_tmp;
                var isbeyond;
                for (; i < 7; i++) { // 일요일부터 토요일까지 출력
                    if (day > total) { // 달이 이어질때, 그 달의 총 일수 초과
                        month++;
                        day = 1;
                        isbeyond = true;
                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
                        if (month == 12)
                            month = 0;
                    }
                         str="<h2 class='h2' style='color=blue'>"+day+"</h2><h3 class='h3'>"+korean_day[i]+"</h3>";
                         $(".weeklyday:eq(" + i + ")").html(str);
                       
                    if (day == today && current_month == month && current_year == year) {
                        $(".h2:eq(" + i + ")").css('color', 'skyblue');
                        $(".h3:eq(" + i + ")").css('color', 'skyblue');

                    } else{
                        $(".h2:eq(" + i + ")").css('color', 'white');
                        $(".h3:eq(" + i + ")").css('color', 'white');
                    }
                    z = 0;
                    day_array[i] = day;
                    for (; z < real_event.length; z++) {

                        if (year == real_event[z].year && month == real_event[z].month && day == real_event[z].day) {

                            var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
                            $("#at" + real_event[z].hour).children().eq(eventday+1).text(real_event[z].title);
                            $("#at" + real_event[z].hour).children().eq(eventday+1).css('padding-top',real_event[z].min+"px");


                        }

                    }
                    day++;

                }
                if (isbeyond) {
                    month = beyond_tmp;
                    month--;
                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month").text(months[month] + " " + year); // 월 년
            })

        },

        pause: function () {
            console.log('calendar pause');
        },

        destroy: function () {
            console.log('calendar destroy');
        },
    }
})
