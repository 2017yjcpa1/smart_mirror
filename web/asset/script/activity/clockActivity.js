define([ 'system', 'jquery', 'input/speechRecog', 'output/speechUtterance', 'jquery-draggable' ],function (system, $, speechRecog, speechUtterance) {
   
   

var clock_inter, stopwatch_inter, stopwatch_state;
    

/*------------------------------*/
/*TIMERS*/
/*------------------------------*/

//clock

var clock = {
  start: function() {
    clock_inter = setInterval(function() {
      var time = new Date();
      var time_hours = (time.getHours() < 10) ? '0' + time.getHours() : time.getHours();
      var time_minutes = (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes();
      var time_seconds = (time.getSeconds() < 10) ? '0' + time.getSeconds() : time.getSeconds();
      document.getElementById('clock').innerHTML = time_hours + ':' + time_minutes + ':' + time_seconds;
    }, 0);
  },
  
  stop: function() {
    clearInterval(clock_inter);
  },
};


        
var today;
var hours, minutes, seconds, day;
var h, m, s;
var alarm_inter;
var snooze=0;
var alarm_onoff;
var alarm_on;        
        
  var alarm = {
      start: 
   function () {
       alarm_inter = setInterval(function() {
 today = new Date();
 hours = today.getHours();
 minutes = today.getMinutes();
 seconds = today.getSeconds();
 day = today.getDay();
 

 
 document.getElementById('clock').innerHTML = hours + ":" + minutes + ":" + seconds;
 
 
    h = document.getElementById('alarm_h').value;
    m = document.getElementById('alarm_m').value;
    s = document.getElementById('alarm_s').value;
    
   
            var count=0;
            if(h==hours && m==minutes && s==seconds)
            {
                   alarm_onoff = playSound(timer_sound);
                               alarm_on = setInterval(function() {
                                      playSound(timer_sound); console.log(7000+snooze);
                                  },6500+snooze) 

            }
                },1000)
           },
   
      stop: function() {
          
          clearInterval(alarm_on);
          clearInterval(alarm_inter);
          clearInterval(alarm_onoff);
          stopSound(timer_sound);
          

      },
      
};

//stopwatch
var start_time = 0;
var elapsed = [];
var spw_state = 0;
var spw_inter;

var stopwatch = {
  start_stop: function() {
    if (spw_state === 0) {
      spw_state = 1;
      start_time = new Date();
      
      spw_inter = setInterval(function() {
        document.getElementById('clock').innerHTML = toTimeFormat(new Date() - start_time + getSum(elapsed), 'mm:ss:msms');
      }, 0);
    } else {
      spw_state = 0;
      elapsed[elapsed.length] = new Date() - start_time;
      clearInterval(spw_inter);
   
    }
  },
  reset: function() {
    elapsed = [];
    document.getElementById('clock').innerHTML = toTimeFormat(0, 'mm:ss:msms');
    document.getElementById('laps').innerHTML = 'LAPS';
    clearInterval(spw_inter);
    spw_state = 0;
  },
  lap: function() {
    document.getElementById('laps').innerHTML = document.getElementById('clock').innerHTML + '<br>' + document.getElementById('laps').innerHTML;
  }
};

//timer
var start_time = 0;
var elapsed_time = 0;
var requested_time;
var timer_inter;

var timer = {
  start: function() {
    start_time = new Date();
    requested_time = toMs(document.getElementById('timer_h').value, document.getElementById('timer_m').value, document.getElementById('timer_s').value, 0);
    
    timer_inter = setInterval(function() {
      elapsed_time = new Date() - start_time;
      document.getElementById('clock').innerHTML = toTimeFormat(requested_time - elapsed_time + 1000, 'hh:mm:ss');
      //+ 1000ms because the seconds are rounded down, so without it when the timer SHOWS 00:00:00, it will have to wait 1s before stopping
      if (elapsed_time >= requested_time) {
        timer.stop();
        timer.end();
      }
    }, 0);
  },
  stop: function() {
    clearInterval(timer_inter);
    stopSound(timer_sound);
  },
  end: function() {
    document.getElementById('clock').innerHTML = '<img src="http://www.dumpt.com/img/viewer.php?file=6iow29yoocvimda5fz6x.png" class="alarm-icon" />';
    playSound(timer_sound);
  }

};

var map, infoWindow;


function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: 35.896205, lng: 128.622019},
                    zoom: 6,
                });
                
                // Create the search box and link it to the google maps
                var autocomplete = new google.maps.places.Autocomplete(document.getElementById('location_input'));
                autocomplete.bindTo('bounds', map);
                
                infoWindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    map: map
                });

                // When a place is selected, show it on the map with local time and UTC time
                // We use infoWindow for this, instead of markers
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    infoWindow.close();
                    var place = autocomplete.getPlace();
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                    }
                  
                    // Find the timezone of result location
                    // Calculate offset (in hours)
                    var utc_offset = place.utc_offset/60;
                    
                    // Format and display the dates in the infoWindow
                    infoWindow.setContent(formatInfoString(place.name, utc_offset));
                    infoWindow.setPosition(place.geometry.location);
                    infoWindow.open(map);
                });

            }
            
            // Use HTML5 geolocation to find your location
            

            // Geolocation failed
            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                                  'Error: The Geolocation service failed.' :
                                  'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(map);
            }
            
            // Formats the string, given place name and offset, to display on the infoWindow
            /* Example String:  
             *
             *  Toronto
             *  Local Time (UTC-5):
             *  Fri, 11 Nov 2016 00:05:40
             *
             *  UTC Time:
             *  Fri, 11 Nov 2016 05:05:40
             */
            function formatInfoString(name, offset) {
                // Find the UTC time
                var utc_time_name = 'UTC Time:';
                var utc_time = new Date(Date.now());
                var utc_time_string = utc_time.toUTCString().substring(0,25);
                
                // Find the local time with a "hack"
                // Add the utc offset to UTC time, and print it as UTC time
                var local_time_name = 'Local Time (UTC' + (offset > 0 ? '+' : '') + offset + '):';
                var modified_time = new Date((new Date)*1 + 1000*3600*offset);
                var modified_time_string = modified_time.toUTCString().substring(0,25);
                
                return '<div style="color: black"><strong>' + name + '</strong><br>' + local_time_name + '<br>' +
                    modified_time_string + '<br><br>' + utc_time_name + '<br>' + utc_time_string;
            }
            


/*------------------------------*/
/*MANAGEMENT*/
/*------------------------------*/
function newOption() {
  
  document.getElementById('clock').innerHTML = '00:00:00'; // 스톱워치와 타이머를 누르면 현재시간이 00:00:00 이 된다.
  alarm.stop();
  clock.stop(); // 현재시간 스톱
  stopwatch.reset(); // 스톱워치 리셋
  timer.stop(); // 타이머 리셋
  document.getElementById('alarm_btn_wrapper').classList.add('hidden');
  
  document.getElementById('alarm_snooze_wrapper').classList.add('hidden');
  document.getElementById('snooze_set_wrapper').classList.add('hidden');
  
  document.getElementById('day_set_wrapper').classList.add('hidden');
  document.getElementById('spw_btn_wrapper').classList.add('hidden');
  document.getElementById('timer_btn_wrapper').classList.add('hidden');
  document.getElementById('world_btn_wrapper').classList.add('hidden');
 
  document.getElementById('lap-wrapper').classList.add('hidden');

}

function alarm_start() {alarm.start();}
function alarm_stop() {alarm.stop();}
function spw_control() {stopwatch.start_stop();}
function spw_lap() {stopwatch.lap();}
function spw_reset() {stopwatch.reset();}
function time_control() {timer.stop(); timer.start();}
function time_end() {timer.end();}
function clock_button() {clock.start();}
function alarmbutton() {document.getElementById("alarm_btn_wrapper").classList.remove('hidden'); document.getElementById("alarm_snooze_wrapper").classList.remove('hidden');}
function dayset() {document.getElementById("day_set_wrapper").classList.remove('hidden');}
function snoozeset() {document.getElementById("snooze_set_wrapper").classList.remove('hidden');}
function spw_button() {document.getElementById('spw_btn_wrapper').classList.remove('hidden'); document.getElementById('lap-wrapper').classList.remove('hidden');}
function timer_button() {document.getElementById('timer_btn_wrapper').classList.remove('hidden');}
function world_button() {document.getElementById('world_btn_wrapper').classList.remove('hidden'); document.getElementById('clock').innerHTML = '';}

/*------------------------------*/
/*UTILITY*/
/*------------------------------*/
function toTimeFormat(t, format) {

  function addDigit(n) {
    return (n < 10 ? '0':'') + n;
  }

  var ms = t % 1000;
  t = (t - ms) / 1000;
  var secs = t % 60;
  t = (t - secs) / 60;
  var mins = t % 60;
  var hrs = (t - mins) / 60;
  ms = (ms < 10) ? '00' : (ms < 100) ? '0' + Math.floor(ms / 10) : Math.floor(ms / 10);

  if (format === 'hh:mm:ss') {
    return addDigit(hrs) + ':' + addDigit(mins) + ':' + addDigit(secs);
  } else if (format === 'mm:ss:msms') {
    return addDigit(mins) + ':' + addDigit(secs) + ':' + ms;
  }
}

function toMs(h, m, s, ms) {
  return (ms + s * 1000 + m * 1000 * 60 + h * 1000 * 60 * 60);
}

function getSum(arr) {
  var a = 0;
  for (var i = 0; i < arr.length; i++) {
    a += arr[i];
  }
  return a;
}

/*------------------------------*/
/*STARTUP*/
/*------------------------------*/

/*------------------------------*/
/*AUDIO*/
/*------------------------------*/
var timer_sound = new Audio('http://www.gravomaster.com/alarm/sounds/SND-Energetic_-_Groovy_TNT.mp3');

function playSound(sound) {
  sound.play();
}
function stopSound(sound) {
  sound.pause();
  sound.currentTime = 0;
}

/*------------------------------*/
/*PRELOAD*/
/*------------------------------*/


    return {
        
        id : 'clockActivity',
        title : '시계',
        icon : 'ic_clock.png',
        layoutHTML : 'activity_clock.html',
        
        init : function () {
            console.log('clock init');
            clock.start();

            //(알람|알림|알람기능|알림기능)\s+(실행|켜줘|보여줘|실행해줘|보고싶어)
            // 알람 음성인식
            speechRecog.addEventListener('(알람|알 람|알림)\\s*(보여줘|보자)', function (isFinal) { if(isFinal) { clock_button(); newOption(); alarmbutton(); }})
            speechRecog.addEventListener('(스톱워치|스탑워치)\\s*(보여줘|보자)', function (isFinal) { if (isFinal) { clock.stop(); newOption(); spw_button(); }})
            speechRecog.addEventListener('타이머\\s*(보여줘|보자)', function (isFinal) { if (isFinal) { clock.stop(); newOption(); timer_button(); }})
            speechRecog.addEventListener('(세계 시간|세계시간)\\s*(보여줘|보자)', function (isFinal) { if (isFinal) { clock.stop(); newOption(); world_button(); initMap(); }})
            
            speechRecog.addEventListener('(반복|한복|반 복|한 복)\\s*(실행|켜줘)', function (isFinal) { if(isFinal) newOption(); snoozeset(); })
            speechRecog.addEventListener('(반복|한복|반 복|한 복)\\s*1분', function (isFinal) { if(isFinal) snooze=1000; })
            speechRecog.addEventListener('(반복|한복|반 복|한 복)\\s*3분', function (isFinal) { if(isFinal) snooze=3000; })
            speechRecog.addEventListener('(반복|한복|반 복|한 복)\\s*5분', function (isFinal) { if(isFinal) snooze=5000; })
            
            speechRecog.addEventListener('(알람|알 람|알림)\\s*(시작|실행)', function (isFinal) { if(isFinal) { alarm.start(); }})
            speechRecog.addEventListener('(알람|알 람|알림)\\s*(멈춰|그만)', function (isFinal) { if(isFinal) { alarm.stop(); }})
            
            speechRecog.addEventListener('(스톱워치|스탑워치)\\s*(시작|실행)', function (isFinal) { if(isFinal) stopwatch.start_stop(); })
            speechRecog.addEventListener('(스톱워치|스탑워치)\\s*랩', function (isFinal) { if(isFinal) stopwatch.lap(); })
            speechRecog.addEventListener('(스톱워치|스탑워치)\\s*그만', function (isFinal) { if(isFinal) stopwatch.reset(); })
            
            speechRecog.addEventListener('([0-9]|[0-9]*[0-9])*시', function (isFinal) { if(isFinal) document.getElementById('timer_h').value; })
            speechRecog.addEventListener('([0-9]|[0-9]*[0-9])*분', function (isFinal) { if(isFinal) document.getElementById('timer_m').value; })
            speechRecog.addEventListener('([0-9]|[0-9]*[0-9])*초', function (isFinal) { if(isFinal) document.getElementById('timer_s').value; })
        
            speechRecog.addEventListener('타이머\\s*(시작|실행)', function (isFinal) { if (isFinal) { timer.stop(); timer.start(); }})
           
            
            $("#one").click(function() { 
                 snooze=1000;
                console.log(snooze);
            }) 

            $("#two").click(function(){
                snooze=3000;
               console.log(snooze);
            })

            $("#three").click(function() {
                snooze=5000;
               console.log(snooze);
                /*setInterval(function() {
                    playSound(timer_sound);
                },1000)*/
            })  
            $('.main-wrapper').draggable({axis: 'y'});
      
            $('#alarm-btn').click(newOption);
            $('#stopwatch-btn').click(newOption);
            $('#timer-btn').click(newOption);
            $('#world-btn').click(newOption);
            $('#alarm-btn').click(alarmbutton);
            $('#stopwatch-btn').click(spw_button);
            $('#timer-btn').click(timer_button);
            $('#world-btn').click(world_button);
            $('#world-btn').click(initMap);
            //$('#world-btn').click(handleLocationError);
            $('#world-btn').click(formatInfoString);
            //$(initMap).submit(formatInfoString);
           
        },
        
        resume : function () {
            console.log('clock resume');
            //ninivert, June 2016
            
             $('#alarm-btn').click(clock_button);
         
             $('#alarmstart').click(alarm_start);
             $('#alarmreset').click(alarm_stop);
             $('#snooze_setting').click(snoozeset);
             $('#alarmday_setting').click(dayset);
             $('#spw_start').click(spw_control);
             $('#spw_lap').click(spw_lap);
             $('#spw_reset').click(spw_reset);
             $('#timeset').click(time_control);
             //$('#location_input').submit(formatInfoString);
             //$('#world-btn').append()(handleLocationError);
             //$('#location_input').append(formatInfoString);
             //$('#world-btn').click(initMap).add(formatInfoString);
             
             // 알람 시간 값

        },
        
        pause : function () {
            console.log('clock pause');
        },
        
        destroy : function () {
            console.log('clock destroy');
        },
    }
})