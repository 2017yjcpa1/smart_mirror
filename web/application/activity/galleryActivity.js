define(['system', 'jquery', 'jquery-draggable'
], function (system, $) {

    // https://www.google.co.kr/search?biw=1902&bih=942&tbm=isch&sa=1&q=css3+brick+html5+flex&oq=css3+brick+html5+flex&gs_l=psy-ab.3...10795.11744.0.11855.5.5.0.0.0.0.157.403.0j3.3.0....0...1.1.64.psy-ab..2.0.0.ck-VAyz3sCU#imgrc=Nw_8p18bGd-MbM:

    return {

        id: 'galleryActivity',
        title: '갤러리',
        icon: 'ic_gallery.png',
        layoutHTML: 'activity_gallery.html',

        init: function () {
            console.log('gallery init');
        },

        resume: function () {
            console.log('gallery resume');
        },

        pause: function () {
            console.log('gallery pause');
        },

        destroy: function () {
            console.log('gallery destroy');
        },
    }
})