define(['system', 'jquery'], function (system) {

    // http://codingbytodesign.net/2014/07/20/kinectcamv2-for-kinect-v2/

    return {

        id: 'cameraActivity',
        title: '카메라',
        icon: 'ic_camera.png',
        layoutHTML: 'activity_camera.html',

        init: function () {
            console.log('camera init');
        },

        resume: function () {
            console.log('camera resume');

            if ( ! (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                return;
            }
            
            var video = $('#cameraActivity video')[0];

            navigator
                .mediaDevices
                .getUserMedia({ video: true })
                .then(function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                });
        },

        pause: function () {
            console.log('camera pause');
        },

        destroy: function () {
            console.log('camera destroy');
        },
    }
})