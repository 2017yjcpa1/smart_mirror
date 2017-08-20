define(['system', 'jquery'], function (system, $) {

    function addSchedule(i){
            $("tr:eq(1)").children().eq(i).html("<ul class='data'></ul>");
            $(".data:eq("+i+")").append(
                    "<li><h1>"+real_event[z].hour+"시" + 
                    real_event[z].min + '분</h1><h2>' + 
                    real_event[z].title+"</h2></li>" 
                    );
    }
    
    function addColor(i){
                    $(".h3:eq(" + i + ")").css({
                                                'color':'black',
                                                'position':'relative',
                                                'font-size': '40px',
                                                'margin': '0'
                                                });
                                            
                    $(".h2:eq(" + i + ")").css({
                                                'position':'relative',
                                                'bottom':'26px'
                                                });
                                            
                    $("tr:eq(0)").children().eq(i).css('background','rgba(255, 255, 255, 0.5)');
                    $("tr:eq(1)").children().eq(i).css('background','rgba(255, 255, 255, 0.5)');
    }
    
    function initColor(i){
                        $(".h3:eq(" + i + ")").css({
                                                    'color':'gray',
                                                    'font-size':'2em',
                                                    'margin':'none'
                                                   });
                                                   
                        $(".h2:eq(" + i + ")").css('bottom','initial');                           
                        $("tr:eq(0)").children().eq(i).css({'background':'initial'});
                        $("tr:eq(1)").children().eq(i).css({'background':'initial'});
    }
    
    function headerDate(month,firstDay,lastDay){ // 그 주의 첫번째,마지막 월,일 
                var m2=(month+1);
                
                if(month<9)
                    m="0"+(month+1);
                else
                    m=(month+1);
            
                if(firstDay<10)
                   firstDay="0"+firstDay;
               
                if(lastDay<10)
                    lastDay="0"+lastDay;
                
                if(firstDay > lastDay)
                    m2++;
                
                if(m2==13)
                    m2=1;
                
            $("#year-month > strong").text(m + '/' + firstDay + '  -  ' +m2 + '/' + lastDay);
        
            }
            
    return {

        id: 'calendarActivity',
        title: '달력',
        icon: 'ic_calendar.png',
        layoutHTML: 'activity_calendar.html',

        init: function () {
            console.log('calendar init');
//            $('#calendarActivity').draggable({axis: 'y'});
        },

        resume: function () {
            console.log('calendar resume');

            var i = 0;
            var day_array = new Array();
            var korean_day=['일','월','화','수','목','금','토'];
            var am = "오전";
            var pm = '오후';
            var firstDay,lastDay,m;

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
                var i = 0;
                for (; p < 23; p++) {
                    console.log("p="+p);
                    for (; i <= 7; i++) {
                        $("tr:eq(1)").children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
    
                    }
                    i=0;
                }
                p = 0;
                $('tr').children().empty();
                
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
                if(i==0)
                    firstDay=s;
                if(i==6)
                    lastDay=s;
                
                str=korean_day[i]+", "+s;
                $("thead > tr > th").eq(i+1).html(str);
                if (s == today) {
                    addColor(i);
                    day_array[i] = s;
                }
//                for (; z < real_event.length; z++) {  // 일정 정리
//
//                    if (year == real_event[z].year && month == real_event[z].month && s == real_event[z].day) { // 년월일이 일치하면
//
//                        var eventday = day_array.indexOf(real_event[z].day); // 일정 day 
//                        
//                        $("tr:eq(2)").children().eq(i).html("<ul></ul>");
//                        
//                        $("ul:eq("+i+")").append(
//                                "<li><h1>"+real_event[z].hour+"시" + 
//                                real_event[z].min + '분</h1><h2>' + 
//                                real_event[z].title+"</h2></li>" 
//                                );
//                        
//                        add_location(z,eventday);
//
//                    }
//
//                }
                    s++;

            }
                    if (isbeyond) {
                        month = beyond_tmp;
                        month--;
                    } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

            $("#year-month").append(year); //0 년
//            $("img[src$='y_prev2.png']").after("<span></span>");
            headerDate(month,firstDay,lastDay);
           
            function add_location(z,eventday){ //  <a href=''>약속장소</a>, 약속장소 클릭 시 map 이 띄어지고 약속 장소 보여줌.                  
                if(real_event[z].location){
//
                        $("tr:eq(2)").children().eq(i).html("<ul></ul>");
                        $("ul:eq("+i+")").append(
                                "<li><h1>"+real_event[z].hour+"시" + 
                                real_event[z].min + '분</h1><h2>' + 
                                real_event[z].title+"</h2></li>" 
                                );
//                      $("tr:eq(1)").children().eq(i).html("<li><h1>"+real_event[z].hour+"시" + real_event[z].min + '분</h1><h2>' + real_event[z].title+"</h2></li>" );
            }
            }
            var sync = function () {
                var tmp = month;
                year = d.getFullYear(); // 2017
                month = d.getMonth(); // 3
                var total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
                var today_date = new Date(months[month] + " " + today + " " + year).toString(); // 오늘의 요일 , Sat April 2017
                var getday = today_date.substring(0, 3); // Sat
                var r = 0;

                var p = 0;
                i = 0;
                
                    for (; i <= 7; i++) {
                         $("tr:eq(1)").children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
                    }

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
                    
                  if(i==0)
                    firstDay=day;
                  if(i==6)
                    lastDay=day;
                
                     str="<h2 class='h2'>"+korean_day[i]+"</h2><h3 class='h3'>"+day+"</h3>";
                     $("tr:eq(0)").children().eq(i).html(str);

                    day_array[i] = day;
                    if (day == today && current_month == month && current_year == year){
                       addColor(i);
                    }    
                    
                    z = 0;
                    for (; z < real_event.length; z++) {

                        if (year == real_event[z].year && month == real_event[z].month && day == real_event[z].day) {
                            var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
                            $("#at" + real_event[z].hour).children().eq(eventday+1).text(real_event[z].title);
                            $("tr:eq(2)").children().eq(i).html("<ul></ul>");
                            $("ul:eq("+i+")").append(
                                "<li><h1>"+real_event[z].hour+"시" + 
                                real_event[z].min + '분</h1><h2>' + 
                                real_event[z].title+"</h2></li>" 
                                );
// 
                            add_location(z,eventday);
                            
                        }

                    }
                    day++;
                }
                if (isbeyond) {
                    month = beyond_tmp;
                    month--;
                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month").text(months[month] + " " + year); // 월 년
                headerDate(month,firstDay,lastDay);
            }
//
//            $('#today').click(function () {
//                console.log('오늘');
//                sync();
//
//            })
//
//            $('img[src$="y_next2.png"]').click(function () {
//                console.log('오른쪽');
//                sunday = sunday + 7;
//                var tmp = month;
//
//                total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
//                var p = 0;
//                i = 0;
//                for (; p < 23; p++) {
//                    for (; i <= 7; i++) {
//                         $("tr:eq(1)").children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
//                    }
//                    i=0;
//                }
//                p = 0;
//                if (sunday > total) { // 다음달로 넘어갈때
//                    month++;
//
//                    if (sunday > total && months[tmp] == 'December') { //  1월로 넘어갈때
//                        year++;
//                        month = 0; // 1월
//
//                    }
//
//
//                    sunday = sunday - total; // 그달의 첫번째 일요일
//
//
//                }
//
//                i = 0;
//                var z = 0;
//                day = sunday;
//                var beyond_tmp;
//                var isbeyond = false;
//                z = 0;
//                for (; i < 7; i++) { // 일요일부터 토요일까지 출력
//                    if (day > total) { // 달이 이어질때, 그 달의 총 일수 초과
//                        month++;
//                        day = 1;
//                        isbeyond = true;
//                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
//                        if (month == 12)
//                            month = 0;
//                    }
//                    
//                        if(i==0)
//                            firstDay=day;
//                        
//                        if(i==6)
//                            lastDay=day;
//                        
//                         str="<h2 class='h2'>"+korean_day[i]+"</h2><h3 class='h3'>"+day+"</h3>";
//                         $("tr:eq(0)").children().eq(i).html(str);
//
//                    if (day == today && current_month == month && current_year == year) {
//                        addColor(i);
//                    } else{
//                        initColor(i);
//                    }
//                    z = 0;
//                    day_array[i] = day;
//                    for (; z < real_event.length; z++) {
//
//                        if (year == real_event[z].year && month == real_event[z].month && day == real_event[z].day) {
//                            var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
//                            
//                            $("tr:eq(1)").children().eq(i).html("<ul></ul>");
//                            $("ul:eq("+i+")").append(
//                                "<li><h1>"+real_event[z].hour+"시" + 
//                                real_event[z].min + '분</h1><h2>' + 
//                                real_event[z].title+"</h2></li>" 
//                                );
////                           
//                            add_location(z,eventday)
//                            $("#at" + real_event[z].hour).children().eq(eventday+1).css('padding-top',real_event[z].min+"px");
//
//
//                        }
//
//                    }
//                    day++;
//
//                }
//                if (isbeyond) {
//                    month = beyond_tmp;
//                    month--;
//                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수
//
//                $("#year-month").text(months[month] + " " + year); // 월 년
//                headerDate(month,firstDay,lastDay);
//            })
//            $('img[src$="y_prev2.png"]').click(function () {
//                console.log('왼쪽');
//
//                sunday = sunday - 7; // 일요일 날짜!!!!
//                var tmp = month;
//                var p = 0;
//                i = 0;
//                for (; p < 23; p++) {
//                    for (; i <= 7; i++) {
//                         $("tr:eq(1)").children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
//                    }
//                    i=0
//                }
//                p = 0;
//                if (sunday <= 0) {
//                    month--;
//
//                    if (sunday <= 0 && months[tmp] == 'January') { // 일요일이 0이하, 1월일때
//                        year--;
//                        month = 11; // 12월
//
//                    }
//
//                    total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
//
//                    sunday = total + (sunday); // 그달의 마지막 일요일
//
//
//                }
//
//
//                i = 0;
//                var z = 0;
//                day = sunday;
//                var beyond_tmp;
//                var isbeyond;
//                for (; i < 7; i++) { // 일요일부터 토요일까지 출력
//                    if (day > total) { // 달이 이어질때, 그 달의 총 일수 초과
//                        month++;
//                        day = 1;
//                        isbeyond = true;
//                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
//                        if (month == 12)
//                            month = 0;
//                    }
//                        if(i==0)
//                            firstDay=day;
//                        
//                        if(i==6)
//                            lastDay=day;
//                        
//                         str="<h2 class='h2'>"+korean_day[i]+"</h2><h3 class='h3'>"+day+"</h3>";
//                         $("tr:eq(0)").children().eq(i).html(str);
//                       
//                    if (day == today && current_month == month && current_year == year) {
//                        addColor(i);
//
//                    } else{
//                        initColor(i);
//                    }
//                    z = 0;
//                    day_array[i] = day;
//                    for (; z < real_event.length; z++) {
//
//                        if (year == real_event[z].year && month == real_event[z].month && day == real_event[z].day) {
//
//                            var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
//                            
//                            $("tr:eq(1)").children().eq(i).html("<ul></ul>");
//                            $("ul:eq("+i+")").append(
//                                "<li><h1>"+real_event[z].hour+"시" + 
//                                real_event[z].min + '분</h1><h2>' + 
//                                real_event[z].title+"</h2></li>" 
//                                );
////                            
//                            add_location(z,eventday);
//                            $("#at" + real_event[z].hour).children().eq(eventday+1).css('padding-top',real_event[z].min+"px");
//
//
//                        }
//
//                    }
//                    day++;
//
//                }
//                if (isbeyond) {
//                    month = beyond_tmp;
//                    month--;
//                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수
//
//                $("#year-month").text(months[month] + " " + year); // 월 년
//                headerDate(month,firstDay,lastDay);
//            })

        },

        pause: function () {
            console.log('calendar pause');
        },

        destroy: function () {
            console.log('calendar destroy');
        },
    }
})
