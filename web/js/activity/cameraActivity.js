define(['system', 'jquery', 'jquery-draggable'], function (system) {

    return {

        id: 'cameraActivity',
        title: '카메라',
        icon: 'ic_camera.png',
        layoutHTML: 'activity_camera.html',

        init: function () {
            console.log('camera init');
            var video = document.getElementById('video');
            var canvas = document.getElementById('frame');
            var take = document.getElementById('take');
            var ctx = canvas.getContext('2d');
            var play=document.getElementById('shutter');
            var localMediaStream = null;
            var count = 0;

            var errorCallback = function (e) {
                console.log('Reeeejected!', e);
            };
            function snapshot() {
                if (localMediaStream) {
                    play.play();
//                    play.playbackRate=2; // 스피드조절 
                    $('#layer').css('background-color','antiquewhite');
                    $('#layer').css('opacity','0.3');
                    setTimeout(shutter,300);
                    ctx.drawImage(video, 0, 0); // 이미지 출력 
                    // "image/webp" works in Chrome.
                    // Other browsers will fall back to image/png.
                    var url = canvas.toDataURL('image/png');
                    document.getElementById('pic').src = canvas.toDataURL(url); //그림을 문자열 형태로,타입설정

                }
                $.ajax({// 사진 저장
                    url: "/smart_mirror/web/php/pic_store_process.php",
                    type: 'POST',
                    data: {url: url}, // 데이터로 바뀐 png 전송!  
                    success: function (result) {
                        if (result) {
//                            alert('success!');
                        } else {
//                            alert('fail!');
                        }
                    }
                })
            }
            function shutter(){
                $('#layer').css('background-color','none');
                 $('#layer').css('opacity','0');
            }
            $('#timer_btn').click(function () {
                if (count == 0) {
                    $('#timer_btn').attr('value', '3초');
                    count = 2;
                    console.log('3초');
                }
                if (count == 3) {
                    $('#timer_btn').attr('value', '5초');
                    count = 4;
                    console.log('5초')
                }
                if (count == 5) {
                    $('#timer_btn').attr('value', '10초');
                    count = 9;
                    console.log('10초')
                }
                if (count == 10) {
                    $('#timer_btn').attr('value', 'timer');
                    count = -1;
                    console.log('타이머 없음')
                }
                count++;
            })
                       
             take.addEventListener('click',function () { setTimeout(snapshot,count*1000) }, false);


            // Not showing vendor prefixes or code that works cross-browser.
            navigator.getUserMedia({video: true}, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream;
            }, errorCallback);
        },

        resume: function () {
            console.log('camera resume');
            count=10;
             $('#timer_btn').attr('value', 'timer');
              count = -1;
              count++;
        },

        pause: function () {
            console.log('camera pause');
            document.getElementById('pic').src = "";
        },

        destroy: function () {
            console.log('camera destroy');
        },
    }
})