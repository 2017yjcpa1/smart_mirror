define(['system', 'jquery', 'jquery-draggable'], function (system) {

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

            $(document).ready(function () {
                var path = '/smart_mirror/gallery/';
                var i = 0;
                
                $.ajax({
                    url: '/smart_mirror/web/php/pic_load_process.php',
                    success: function (data) {
                        var file = JSON.parse(data);
                        for (i; i < file.length; i++) {
                            $('#gallery').append("<a href='" + path + file[i] + "'><img class='sisi' src='" + path + file[i] + "'></a>")
                        }
                    }
                })
            })

            
            
        },

        pause: function () {
            console.log('gallery pause');
            $('#gallery').empty();
        },

        destroy: function () {
            console.log('gallery destroy');
        },
    }
})