define(['system', 'jquery', 'lib/forecast.io'], function (system, $, ForecastIO) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var map;
    var forecast = new ForecastIO({
        PROXY_SCRIPT: 'php/weather_proxy.php'
    });
    function initialize() {
        var youngjin = new google.maps.LatLng(35.896205, 128.622019);
        var mapOptions = {
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: youngjin,
            fullscreenControl: true,
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function () {
            geocodeAddress(geocoder, map);
        });
        map.addListener('click', function (event) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
                map: map,
                title: 'click',
                draggable: true,
                animation: google.maps.Animation.DROP
            });
            var locations = [
                {
                    latitude: event.latLng.lat(),
                    longitude: event.latLng.lng()
                }

            ];
            var infowindow = new google.maps.InfoWindow({
                content: '위도 : ' + event.latLng.lat() + '</br>경도 : ' + event.latLng.lng()
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
            forecast.getCurrentConditions(locations, function (conditions) {
                var items = '';

                for (var i = 0; i < conditions.length; i++) {
                    items += '<b><img src="./res/drawable/weather_images/'
                            + conditions[i].getIcon() + '.png" height="35" width="35">'
                            + ((conditions[i].getTemperature() - 32) / 1.8).toFixed(1)
                            + '℃&nbsp;&nbsp;<img src="./res/drawable/weather_images/precipitationProbability.png" height="25" width="25">' 
                            + (conditions[i].getPrecipitationProbability() * 100).toFixed(0)
                            + '%</b>';
                }
                document.getElementById('currentTemp').innerHTML = items;
            });
            marker.addListener('dragend', function () {
                marker.setMap(null);
            });
        });
        directionsDisplay.setMap(map);//경로찾기 기능 활성화
    }

    function geocodeAddress(geocoder, resultsMap) {//장소찾기 함수
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
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

    function weatherRequest() {//날씨로 이동하는 함수
        require(['system'], function (system) {
            system.startActivity('weatherActivity', null, true);
        });
    }
    return {
        id: 'mapsActivity',
        title: '지도',
        icon: 'ic_maps.png',
        layoutHTML: 'activity_maps.html',
        init: function () {
            console.log('maps init');
        },
        resume: function () {
            console.log('maps resume');
            initialize();
            $('#mapsearch').click(calcRoute);
            //$('#weatherbtn').click(weatherRequest);
        },
        pause: function () {
            console.log('maps pause');
        },
        destroy: function () {
            console.log('maps destroy');
        },
    }
})