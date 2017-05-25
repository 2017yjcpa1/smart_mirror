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
            var play = document.getElementById('shutter');
            var localMediaStream = null;
            var count = 0;

            var errorCallback = function (e) {
                console.log('Reeeejected!', e);
            };
            function snapshot() {
                if (localMediaStream) {
                    play.play();
//                    play.playbackRate=2; // 스피드조절 
                    $('#layer').css('background-color', 'antiquewhite');
                    $('#layer').css('opacity', '0.3');
                    setTimeout(shutter, 200);
                    ctx.drawImage(video, 0, 0); // 이미지 출력 
                    // "image/webp" works in Chrome.
                    // Other browsers will fall back to image/png.
                    var url = canvas.toDataURL('image/png');                  
                    document.getElementById('pic').src = canvas.toDataURL(url); //그림을 문자열 형태로,타입설정
                    console.log("사진 데이터 :"+canvas.toDataURL(url));
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
            function shutter() {
                $('#layer').css('background-color', 'none');
                $('#layer').css('opacity', '0');
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

            take.addEventListener('click', function () {
                setTimeout(snapshot, count * 1000)
            }, false);

            /*  동영상  */
           
            'use strict';

            /* globals MediaRecorder */

            var mediaSource = new MediaSource();
            mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
            var mediaRecorder;
            var recordedBlobs;
            var sourceBuffer;
            var recordedVideo = document.querySelector('video#recorded');

            var recordButton = document.querySelector('button#record');
            var playButton = document.querySelector('button#play');
            var downloadButton = document.querySelector('button#download');
            recordButton.onclick = toggleRecording;
            downloadButton.onclick = download;

            // window.isSecureContext could be used for Chrome
            var isSecureOrigin = location.protocol === 'https:' ||
                    location.hostname === 'localhost';
            if (!isSecureOrigin) {
                alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
                        '\n\nChanging protocol to HTTPS');
                location.protocol = 'HTTPS';
            }

            var constraints = {
                audio: false,
                video: true
            };
             var audioOn = {
                audio: true,
                video: true
            };

            function handleSuccess(stream) {
                recordButton.disabled = false;
                console.log('getUserMedia() got stream: ', stream);
                window.stream = stream;
                if (window.URL) {
                    video.src = window.URL.createObjectURL(stream);
                } else {
                    video.src = stream;
                }
            }

            function handleError(error) {
                console.log('navigator.getUserMedia error: ', error);
            }

            function handleSourceOpen(event) {
                console.log('MediaSource opened');
                sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
                console.log('Source buffer: ', sourceBuffer);
            }

            recordedVideo.addEventListener('error', function (ev) {
                console.error('MediaRecording.recordedMedia.error()');
                alert('Your browser can not play\n\n' + recordedVideo.src
                        + '\n\n media clip. event: ' + JSON.stringify(ev));
            }, true);

            function handleDataAvailable(event) {
                if (event.data && event.data.size > 0) {
                    recordedBlobs.push(event.data);
                }
            }

            function handleStop(event) {
                console.log('Recorder stopped: ', event);
            }

            function toggleRecording() {
                if (recordButton.textContent === '녹화시작') {
                    startRecording();
                } else {
                    stopRecording();
                    recordButton.textContent = '녹화시작 ';
                    playButton.disabled = false;
                    downloadButton.disabled = false;
                }
            }

            function startRecording() {               
            navigator.mediaDevices.getUserMedia(audioOn).
                    then(handleSuccess).catch(handleError);
                recordedBlobs = [];
                var options = {mimeType: 'video/webm;codecs=vp9'}; // https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types 
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.log(options.mimeType + ' is not Supported');
                    options = {mimeType: 'video/webm;codecs=vp8'};
                    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                        console.log(options.mimeType + ' is not Supported');
                        options = {mimeType: 'video/webm'};
                        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                            console.log(options.mimeType + ' is not Supported');
                            options = {mimeType: ''};
                        }
                    }
                }
                try {
                    mediaRecorder = new MediaRecorder(window.stream, options);
                } catch (e) {
                    console.error('Exception while creating MediaRecorder: ' + e);
                    alert('Exception while creating MediaRecorder: '
                            + e + '. mimeType: ' + options.mimeType);
                    return;
                }
                console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
                recordButton.textContent = '녹화정지';
                playButton.disabled = true;
                downloadButton.disabled = true; 
                mediaRecorder.ondataavailable = handleDataAvailable; //녹화된 데이터 저장
                mediaRecorder.onstop = handleStop; // 녹화 정지후 응답 
                mediaRecorder.start(10); // collect 10ms of data
                console.log('MediaRecorder started', mediaRecorder);
            }

            function stopRecording() {              
                navigator.mediaDevices.getUserMedia(constraints).
                    then(handleSuccess).catch(handleError);
                mediaRecorder.stop();
                mediaRecorder.onstop = handleStop; // 녹화 정지후 응답 
                console.log('Recorded Blobs: ', recordedBlobs);
                recordedVideo.controls = true;
            }

            function play() {
                var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
                recordedVideo.src = window.URL.createObjectURL(superBuffer);
            }

            function download() {
                var blob = new Blob(recordedBlobs, {type: 'video/webm'}); // 
                var url = window.URL.createObjectURL(blob);
                console.log("여기서 다운 :"+url);
//                $.ajax({
//                    url: '/camera/video_store_process.php',
//                    type: 'POST',
//                    data: {data: url},
//                    success: function (data) {
//                        console.log('성공');
//                        window.URL.revokeObjectURL(url);
//                    }
//                })


                  var a = document.createElement('a');
                  a.style.display = 'none';
                  a.href = url;
                  a.download = 'test.webm';
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }, 100);
            }
            navigator.getUserMedia({video: true}, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream;
            }, errorCallback);
            
            
            navigator.mediaDevices.getUserMedia(constraints).
                    then(handleSuccess).catch(handleError);



        },

        resume: function () {
            console.log('camera resume');
            count = 10;
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