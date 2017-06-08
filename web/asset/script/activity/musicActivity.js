define(['system', 'jquery'], function (system) {

    return {

        id: 'musicActivity',
        title: '음악',
        icon: 'ic_music.png',
        layoutHTML: 'activity_music.html',

        init: function () {
            console.log('music init');
            var i = 0;
            $.ajax({
                url: '/smart_mirror/web/php/pullSongs.php',
                success: function (data) {
                    var songs = JSON.parse(data); // JSON 포맷 -> js객체 
                    for (; i < songs.length; i++) {
                        $('#list_table').append(
                                '<tr><td class="music_td">'+
                                '<div class="att" id="title"><h3 class="title">'+songs[i].title+'</h3></div>'+
                                '<div class="att" id="artist"><h5 class="artist">'+songs[i].artist+'</h5></div>'+
                                '<div class="att" id="playtime"><h5 class="playtime">'+songs[i].playtime+'</h5></div>'+
                                '<div class="att"><img class="music_picture" src="'+'data:'+'img/jpeg'+';base64,'+
                                 songs[i].picture+'"/></div>'+
                                '<div class="album_location"><h5 class="album"><'+songs[i].album+'></h5></div>'+
                                '</tr></td>');
                    }
                }
            })
//            $('#list_table').html
        },

        resume: function () {
            console.log('music resume');
        },

        pause: function () {
            console.log('music pause');
        },

        destroy: function () {
            console.log('music destroy');
        },
    }
})