define([ 'system' , 'jquery' ],function (system,$) {

    return {

        id : 'calendarActivity',
        title : '달력',
        icon : 'ic_calendar.png',
        layoutHTML : 'activity_calendar.html',

        init : function () {
            console.log('calendar init');

        },

        resume : function () {
            console.log('calendar resume');


            var d=new Date();

            var days=['Sun','Mon','Tue','Wen','Thu','Fri','Sat'];
            var months=['January','February','March','April','May','Jun','July','August','September','October','Nobember','December'];

            var year=d.getFullYear(); // 2017
            var month=d.getMonth(); // 3

            var today=d.getDate(); // 오늘 일
            var first_date=months[month]+' 0 '+year; // 떡밥

            var getFirstday=new Date(first_date).toString(); //Sat April 2017  , 그달의 첫번째 요일
            var total=new Date(year,month+1,0).getDate(); // 그달의 총 일수
            var firstday=getFirstday.substring(0,3); // 요일만 빼냄

            var day_no=days[firstday];
            //--------------------------------------월간 --------------------------


            var jan=months[0]+' 1 '+year; // 떡밥
            var janfirst=new Date(jan).toString(); //Sun Jan 01 2017 00:00:00 GMT+0900 (대한민국 표준시)
            var jan_firstday=janfirst.substring(0,3); // 요일만 빼냄


            var sum=0; var i=1;
            for(; i<=month; i++){ // 이번달 까지의 총 일수
               total_sofar=new Date(year,i,0).getDate();
               sum+=total_sofar;
            }
            sum=sum+today;


            var today_date=new Date(months[month]+" "+today+" "+year).toString(); // 오늘의 요일 구하는 방법, Sat April 2017
            var getday=today_date.substring(0,3);  // Sat April 2017 에서 Sat만 빼냄

            var r=0;


            if(getday!='Sun'){

              while(getday!=days[r]){ // 오늘이 일요일이 아니라면
                r++;
              }
            }

            var sunday=today-r; // 일요일 날짜!!!!


            var s=sunday;
            var isbeyond=false;
            i=0;
            for(; i<7; i++){ // 일요일부터 토요일까지 출력
              if(s>total){ // 달이 이어질때, 그 달의 총 일수 초과
                month++;s=1; isbeyond=true; beyond_tmp=month; // beyond_tmp로 12~1월 제어
                if(month==12)month=0;
              }
              $(".weeklyday:eq("+i+")").text((month+1)+" "+s);
              s++;

            }
            if(isbeyond){month=beyond_tmp; month--;} // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

            $("#year-month").text(months[month]+" "+year); // 월 년

            $('#today').click(function(){
              var tmp=month;
              year=d.getFullYear(); // 2017
              month=d.getMonth(); // 3
              var total=new Date(year,month+1,0).getDate(); // 그달의 총 일수
              var today_date=new Date(months[month]+" "+today+" "+year).toString(); // 오늘의 요일 , Sat April 2017
              var getday=today_date.substring(0,3); // Sat
              var r=0;


              if(getday!='Sun'){
                console.log('나와랏');
                while(getday!=days[r]){ // 오늘이 일요일이 아니라면
                  r++;
                }
              }

              sunday=today-r; // 일요일 날짜!!!!

                if(sunday>total){ // 다음달로 넘어갈때
                  month++;

                  if(sunday>total && months[tmp]=='December'){ //  1월로 넘어갈때
                    year++;
                    month=0; // 1월
                    console.log('year : '+year);
                  }

                  console.log('total : '+total);
                  sunday=sunday-total; // 그달의 첫번째 일요일


                  }

                i=0;
                day=sunday;
                var beyond_tmp;
                var isbeyond=false;
                for(; i<7; i++){ // 일요일부터 토요일까지 출력
                  if(day>total){ // 달이 이어질때, 그 달의 총 일수 초과
                    month++;day=1; isbeyond=true; beyond_tmp=month; // beyond_tmp로 12~1월 제어
                    if(month==12)month=0;
                  }
                  $(".weeklyday:eq("+i+")").text((month+1)+" "+day);
                  day++;

                }
                if(isbeyond){month=beyond_tmp; month--;} // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month").text(months[month]+" "+year); // 월 년
            })

            $('#right').click(function(){
              console.log('오른쪽');
              sunday=sunday+7;
              var tmp=month;

              total=new Date(year,month+1,0).getDate(); // 그달의 총 일수

                if(sunday>total){ // 다음달로 넘어갈때
                  month++;

                  if(sunday>total && months[tmp]=='December'){ //  1월로 넘어갈때
                    year++;
                    month=0; // 1월
                    console.log('year : '+year);
                  }

                  console.log('total : '+total);
                  sunday=sunday-total; // 그달의 첫번째 일요일


                  }

                i=0;
                day=sunday;
                var beyond_tmp;
                var isbeyond=false;
                for(; i<7; i++){ // 일요일부터 토요일까지 출력
                  if(day>total){ // 달이 이어질때, 그 달의 총 일수 초과
                    month++;day=1; isbeyond=true; beyond_tmp=month; // beyond_tmp로 12~1월 제어
                    if(month==12)month=0;
                  }
                  $(".weeklyday:eq("+i+")").text((month+1)+" "+day);
                  day++;

                }
                if(isbeyond){month=beyond_tmp; month--;} // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month").text(months[month]+" "+year); // 월 년
            })
            $('#left').click(function(){
              console.log('왼쪽');

              sunday=sunday-7; // 일요일 날짜!!!!
              var tmp=month;

              if(sunday<=0){
                month--;

                if(sunday<=0 && months[tmp]=='January'){ // 일요일이 0이하, 1월일때
                  year--;
                  month=11; // 12월
                  console.log('year : '+year);
                }

                total=new Date(year,month+1,0).getDate(); // 그달의 총 일수
                console.log('total : '+total);
                sunday=total+(sunday); // 그달의 마지막 일요일


                }


              i=0;

              day=sunday;
              var beyond_tmp;
              var isbeyond;
              for(; i<7; i++){ // 일요일부터 토요일까지 출력
                if(day>total){ // 달이 이어질때, 그 달의 총 일수 초과
                  month++;day=1; isbeyond=true; beyond_tmp=month; // beyond_tmp로 12~1월 제어
                  if(month==12)month=0;
                }
                $(".weeklyday:eq("+i+")").text((month+1)+" "+day);
                day++;

              }
              if(isbeyond){month=beyond_tmp; month--;} // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

              $("#year-month").text(months[month]+" "+year); // 월 년
            })

            //******** resume 에선 현재 주간만 보여주면 됨. 근데 버그 있음 *****************

            // var today_date=new Date(months[month]+" "+today+" "+year).toString(); // 오늘의 요일 , Sat April 2017
            // var getday=today_date.substring(0,3);
            //
            // var r=0;
            //
            //
            // if(getday!='Sun'){
            //
            //   while(getday!=days[r]){ // 오늘이 일요일이 아니라면
            //     r++;
            //   }
            // }
            //
            // var sunday=today-r; // 일요일 날짜!!!!
            //
            //
            // var s=sunday;
            // var isbeyond=false;
            // i=0;
            // for(; i<7; i++){ // 일요일부터 토요일까지 출력
            //   if(s>total){ // 달이 이어질때, 그 달의 총 일수 초과
            //     month++;s=1; isbeyond=true; beyond_tmp=month; // beyond_tmp로 12~1월 제어
            //     if(month==12)month=0;
            //   }
            //   $(".weeklyday:eq("+i+")").text((month+1)+" "+s);
            //   s++;
            //
            // }
            // if(isbeyond){month=beyond_tmp; month--;} // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수
            //
            // $("#year-month").text(months[month]+" "+year); // 월 년

        },

        pause : function () {
            console.log('calendar pause');
        },

        destroy : function () {
            console.log('calendar destroy');
        },
    }
})
