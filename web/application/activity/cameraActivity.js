define(['system', 'jquery'], function (system) {

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
video.crossOrigin = 'anonymous';
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