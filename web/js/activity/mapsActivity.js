define([ 'system','jquery' ],function (system,$) {
    
    return {
        
        id : 'mapsActivity',
        title : '지도',
        icon : 'ic_maps.png',
        layoutHTML : 'activity_maps.html',
        
        init : function () {
            console.log('maps init');
        },
        
        resume : function () {
            console.log('maps resume');   
            var container = document.getElementById("map");
            var mapOption = {
                center: [35.896205,128.622019],
                level: 3
            };
            var map = new own.DaumMap(container, mapOption);//지도 초기화

            var markerOption={
                position: [35.896205,128.622019]
            };

            var marker1 = new own.Marker(markerOption);//마커객체생성
            marker1.map(map);
            },
        
        pause : function () {
            console.log('maps pause');
        },
        
        destroy : function () {
            console.log('maps destroy');
        },
    }
})