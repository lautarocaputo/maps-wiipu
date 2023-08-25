let map;
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
    });

    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.setCenter({ lat: userLat, lng: userLng });

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

    var markers = [];
    var heatmapData = []; // Datos para el mapa de calor

    map.setOptions({
        styles: [{ featureType: "poi.business", stylers: [{ visibility: "off" }] }],
    });

    $.ajax({
        url: "./php/getCoordenadas.php",
        type: "GET",
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {

                var latLng = new google.maps.LatLng(data[i].latitud, data[i].longitud);
                heatmapData.push(latLng);

                var marker = new google.maps.Marker({
                    position: { lat: parseFloat(data[i].latitud), lng: parseFloat(data[i].longitud) },
                    map: map,
                    title: "Marcador " + (i + 1),
                });

                var infowindow = new google.maps.InfoWindow({
                    content: "Latitud: " + data[i].latitud + "<br>Longitud: " + data[i].longitud
                });


                marker.addListener('click', function () {
                    infowindow.open(map, this);
                });

                markers.push(marker);
            }

            // Crear capa de mapa de calor
            new google.maps.visualization.HeatmapLayer({
                data: heatmapData,
                map: map,
                radius: 20,
            });

            new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        },
        error: function () {
            console.log("Error al obtener las coordenadas.");
        }
    });

}



