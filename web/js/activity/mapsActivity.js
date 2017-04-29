define(['system', 'jquery'], function (system, $) {
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var map;

            function initialize() {
                var youngjin = new google.maps.LatLng(35.896205, 128.622019);
                var mapOptions = {
                    zoom: 17,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: youngjin
                };
                map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                directionsDisplay.setMap(map);
            }

            function calcRoute() {
                console.log(arguments.callee)
                var start = document.getElementById('start').value;
                var end = document.getElementById('end').value;

                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.DirectionsTravelMode.TRANSIT
                };
                var directionsService = new google.maps.DirectionsService();
                directionsService.route(request, function (response, status) {
                    console.log(response, status)
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
        },
        resume: function () {
            console.log('maps resume'); 
            initialize();
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