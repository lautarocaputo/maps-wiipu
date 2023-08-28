
const latitude = -34.598546434955466;
const longitude = -58.4945264827228;

const mapStyle = [
    {
        featureType: "poi.school",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi.medical",
        stylers: [{ visibility: "off" }],
    },
];




function initMap() {
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        mapTypeId: 'roadmap',
        styles: mapStyle,
        maxZoom:100,
    });

    function calculateAndDisplayRoute(start, end, travelMode) {
        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
        })
    };

    const trafficLayer = new google.maps.TrafficLayer();
    const userLat=0;
    const userLng=0;

     trafficLayer.setMap(map);

    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.setCenter({ lat: userLat, lng: userLng });

                const marcadorUsuario = new google.maps.Marker({
                    position: { lat: userLat, lng: userLng },
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/kml/shapes/man.png'
                });

                
            },
            function (error) {
                console.error("Error al obtener la ubicación del usuario:", error);
                map.setCenter({ lat: latitude, lng: longitude });
            }
        );
    } else {
        console.log("Geolocalización no soportada en este navegador.");
        map.setCenter({ lat: latitude, lng: longitude });
    }

    


    $.ajax({
        url: "../php/getCoordenadasDeUsuario.php",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var markers = [];
            var userRouteCoordinates = []; // Coordenadas para la ruta de calor del usuario
            var bounds = new google.maps.LatLngBounds(); // Crear un nuevo objeto LatLngBounds
            var clusterOptions = {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                gridSize: 10, // Ajusta este valor según tus necesidades
                maxZoom: 20,
            };

            var duplicateCoordinates = {};

            for (var i = 0; i < data.length; i++) {
                var latLng = new google.maps.LatLng(data[i].lat, data[i].lng);

                 // Comprobar si estas coordenadas ya están en uso
                 if (duplicateCoordinates[latLng.toString()]) {
                    // Agregar un pequeño desplazamiento en las coordenadas
                    var offset = (Math.random() - 0.5) * 0.0001;
                    latLng = new google.maps.LatLng(
                        latLng.lat() + offset,
                        latLng.lng() + offset
                    );
                } else {
                    duplicateCoordinates[latLng.toString()] = true;
                }

                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: "Marcador " + (i + 1),
                    icon:'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png',
                });

                marker.addListener('click', function () {
                    // Calcular y mostrar ruta CAMINANDO desde el usuario hasta este marcador
                    calculateAndDisplayRoute(new google.maps.LatLng(-34.59135577442355, -58.50688373703407), marker.position, 'WALKING');
                });

                var infowindow = new google.maps.InfoWindow({
                    content: "Latitud: " + data[i].lat + "<br>Longitud: " + data[i].lng
                });

                marker.addListener('click', function () {
                    infowindow.open(map, this);
                });

                markers.push(marker);

                // Agregar el marcador a los límites del mapa
                bounds.extend(latLng);

                // Agregar coordenadas a la ruta de calor
                userRouteCoordinates.push(latLng);
            }

            // Crear mapa de calor de la ruta
            var userHeatmap = new google.maps.visualization.HeatmapLayer({
                data: userRouteCoordinates,
                map: map,
                radius: 50 // Ajusta este valor según tus preferencias
            });

            // Ajustar el nivel de zoom para que los marcadores y la ruta sean visibles
            map.fitBounds(bounds);
            var newMarkerCluster = new MarkerClusterer(map, markers, clusterOptions);

        },
        error: function () {
            console.log("Error al obtener las coordenadas.");
        }
    });
}