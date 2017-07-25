define(['system', 'jquery', 'jquery-draggable'
], function (system, $) {

    return {

        id: 'galleryActivity',
        title: '갤러리',
        icon: 'ic_gallery.png',
        layoutHTML: 'activity_gallery.html',

        init: function () {
            console.log('gallery init');
            

            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflow: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows : true
                }
            });
            
            $(window).resize();
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