define([ 'system','jquery','jquery-draggable' ],function (system) {
    
    return {
        
        id : 'cameraActivity',
        title : '카메라',
        icon : 'ic_camera.png',
        layoutHTML : 'activity_camera.html',
        
        init : function () {
            console.log('camera init');
             var video = document.getElementById('video');
            var canvas = document.getElementById('frame');
            var take = document.getElementById('take');
            var ctx = canvas.getContext('2d');
            var localMediaStream = null;

            var errorCallback = function (e) {
                console.log('Reeeejected!', e);
            };
            function snapshot() {
                if (localMediaStream) {
                    ctx.drawImage(video, 0, 0); // 이미지 출력 
                    // "image/webp" works in Chrome.
                    // Other browsers will fall back to image/png.
                    var url = canvas.toDataURL('image/png');
                    document.getElementById('pic').src = canvas.toDataURL(url); //그림을 문자열 형태로,타입설정 
                }
                $.ajax({ // 사진 저장
                    url: "/smart_mirror/web/php/pic_store_process.php",
                    type: 'POST',
                    data: {url: url}, // 데이터로 바뀐 png 전송!  
                    success: function (result) {
                        if (result) {
                            alert('success!');
                        } else {
                            alert('fail!');
                        }
                    }
                })
            };

              
            take.addEventListener('click', snapshot, false);

            // Not showing vendor prefixes or code that works cross-browser.
            navigator.getUserMedia({video: true}, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream;
            }, errorCallback);
        },
        
        resume : function () {
            console.log('camera resume');

        },
        
        pause : function () {
            console.log('camera pause');
            document.getElementById('pic').src = "";
        },
        
        destroy : function () {
            console.log('camera destroy');
        },
    }
})