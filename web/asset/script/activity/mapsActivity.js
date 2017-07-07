define(['system', 'jquery', 'async!' + GOOGLE_MAPS_JS], function (system, $) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var map;
    var marker;
    function calendar_map(location){ // 캘린더와 연동 할때 쓸 함수 
        document.getElementById('address').setAttribute('value',location);
        var geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map);
    }
    function initialize() {
        var youngjin = new google.maps.LatLng(35.896205, 128.622019);
        var mapOptions = {
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: youngjin,
            fullscreenControl: true,
            mapTypeControl: false,
            streetViewControl: false
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function () {
            geocodeAddress(geocoder, map);
        });
        directionsDisplay.setMap(map);//경로찾기 기능 활성화
    }
    function geocodeAddress(geocoder, resultsMap) {//장소찾기 함수
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);

                var locations = [
                    {
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng()
                    }
                ];
                if(marker !=null) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
                var infowindow = new google.maps.InfoWindow({
                    content: document.getElementById('address').value
                });
                infowindow.open(map, marker);
                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
    function calcRoute() {//경로찾기함수
        console.log(arguments.callee);
        var start = document.getElementById('start').value;
        var end = document.getElementById('end').value;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.TRANSIT
        };
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            console.log(response, status);
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
    return {
        id: 'mapsActivity',
        title: '지도',
        icon: 'ic_maps.png',
        layoutHTML: 'activity_maps.html',
        init: function () {
            console.log('maps init');
            initialize();
        },
        resume: function () {
            console.log('maps resume');
            $('#mapsearch').click(calcRoute);
        },
        pause: function () {
            console.log('maps pause');
        },
        destroy: function () {
            console.log('maps destroy');
        },
    }
})