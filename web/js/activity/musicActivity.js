define([ 'system','jquery' ],function (system) {
    
    return {
        
        id : 'musicActivity',
        title : '음악',
        icon : 'ic_music.png',
        layoutHTML : 'activity_music.html',
        
        init : function () {
            console.log('music init');
//            $.ajax({
//                url:'/smart_mirror/web/php/pullSongs.php',
//                success: function (data) {
//                    $('#list_table').html('<tr><td>'+data+'</tr></td>');
//                }
//            })
//            $('#list_table').html
        },
        
        resume : function () {
            console.log('music resume');
        },
        
        pause : function () {
            console.log('music pause');
        },
        
        destroy : function () {
            console.log('music destroy');
        },
    }
})