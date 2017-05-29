define([ 'system', 'jquery', 'jquery-draggable' ],function (system, $) {
   
   

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
  }
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

  

/*------------------------------*/
/*MANAGEMENT*/
/*------------------------------*/
function newOption() {
  
  document.getElementById('clock').innerHTML = '00:00:00'; // 스톱워치와 타이머를 누르면 현재시간이 00:00:00 이 된다.
  clock.stop(); // 현재시간 스톱
  stopwatch.reset(); // 스톱워치 리셋
  timer.stop(); // 타이머 리셋
  document.getElementById('alarm_btn_wrapper').classList.add('hidden');
  document.getElementById('alarm_set_wrapper').classList.add('hidden');
  document.getElementById('spw_btn_wrapper').classList.add('hidden');
  document.getElementById('timer_btn_wrapper').classList.add('hidden');
  document.getElementById('lap-wrapper').classList.add('hidden');
}

function spw_control() {
    
    stopwatch.start_stop();
}

function spw_lap() {
    
    stopwatch.lap();
}

function spw_reset() {
    
    stopwatch.reset();
}

function time_control() {
    
    timer.stop();
    timer.start();
}

function  time_end() {
    timer.end();
}

function clock_button() {
    
    clock.start();
}

function alarmset() {
    
    document.getElementById("alarm_btn_wrapper").classList.remove('hidden');
}

function alarmbutton() {
    
    document.getElementById("alarm_set_wrapper").classList.remove('hidden');
}

function spw_button() {
    
    document.getElementById('spw_btn_wrapper').classList.remove('hidden'); 
    document.getElementById('lap-wrapper').classList.remove('hidden');
}


function timer_button() {
    
    document.getElementById('timer_btn_wrapper').classList.remove('hidden');
}


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
var timer_sound = new Audio('http://tylergrund.com/mp3/Super_25ma_sm.mp3');

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
            
            $('.main-wrapper').draggable({axis: 'y'});
            
            $('#alarm-btn').click(newOption);
            $('#stopwatch-btn').click(newOption);
            $('#timer-btn').click(newOption);
            
            $('#alarm-btn').click(alarmset);
            $('#stopwatch-btn').click(spw_button);
            $('#timer-btn').click(timer_button);
           
            
        },
        
        resume : function () {
            console.log('clock resume');
            //ninivert, June 2016
            
             $('#alarm-btn').click(clock_button);
             $('#alarm_btn_wrapper').click(alarmbutton);
             $('#spw_start').click(spw_control);
             $('#spw_lap').click(spw_lap);
             $('#spw_reset').click(spw_reset);
             $('#timeset').click(time_control);
        },
        
        pause : function () {
            console.log('clock pause');
        },
        
        destroy : function () {
            console.log('clock destroy');
        },
    }
})

