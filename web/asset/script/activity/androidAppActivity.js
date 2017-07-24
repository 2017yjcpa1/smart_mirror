define(['system', 'jquery'], function (system, $) {

    return {

        id: 'androidAppActivity',
        title: '어플 다운로드',
        icon: '',
        layoutHTML: 'activity_android_app.html',

        init: function () {
            console.log('android_app init'); 
        },

        resume: function () {
            console.log('android_app resume');
        },

        pause: function () {
            console.log('android_app pause');
        },

        destroy: function () {
            console.log('android_app destroy');
        },
    }
})
