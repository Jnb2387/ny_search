mapboxgl.accessToken = 'pk.eyJ1Ijoiam5iMjM4NyIsImEiOiJjamZ4MWM3MmYwdnRlMzNuMTdybjNiMGZkIn0.XNRMd-IS-iN1yiSPaOY-Cg';
var map = new mapboxgl.Map({
    container: 'map',
     style:'mapbox://styles/jnb2387/cjiwfye5d1ls82rpmkrjsnac8',
    zoom: 6,
    center: [-76.249, 42.958],
    hash: true,
});
map.addControl(new mapboxgl.NavigationControl());



var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox:[-80.0744, 40.3977, -72.4389, 44.9656],
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
var ny_geocodes=[];
var coords;
var popup; // SO WE CAN GRAB THE POPUP FROM ANYWHERE


map.on('load', updateGeocoderProximity); // set proximity on map load
map.on('moveend', updateGeocoderProximity); // and then update proximity each time the map moves

function updateGeocoderProximity() {
    if (map.getZoom() > 9) {
        var center = map.getCenter().wrap(); // ensures the longitude falls within -180 to 180 as the Geocoding API doesn't accept values outside this range
        geocoder.setProximity({
            longitude: center.lng,
            latitude: center.lat
        });
    } else {
        geocoder.setProximity(null);
    }
}

// Disable default box zooming.
map.boxZoom.disable();

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: false
});


map.on('load', function() {
    // map.addSource('zip_polygon', {
    //     'type': 'vector',
    //     'url': 'mapbox://jnb2387.ct82c8j8'
    // });

    // map.addLayer({
    //     'id': 'zip_polygon',
    //     'source': 'zip_polygon',
    //     'source-layer': 'ny_zips-4vg7jg',
    //     'type': 'fill',
    //     'paint': {
    //         'fill-color': [
    //             'interpolate',
    //             ['linear'],
    //            ["to-number", ['get', 'zip_code']],
    //             0, '#F2F12D',
    //             12300, 'red',
    //             12400, 'blue',
    //             12500, 'green'
    //         ],
    //         'fill-opacity': 0.45
    //     }
    // }, 'waterway-label');





    // //=====GEOCODER POINT
    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });
    map.addLayer({
        "id": "geocodepoint",
        "source": "single-point",
        "type": "circle",
        "paint": {
            "circle-radius": 12,
            "circle-color": "blue"
        }
    });
    geocoder.on('result', function(ev) {
        if (latlonpopup) {
            latlonpopup.remove()
        } //REMOVE ANY POPUPS ON MAP

        map.getSource('single-point').setData(ev.result.geometry);
    });
}); // END MAP LOAD


var toggleableLayerIds = ['nyaddresscenter', 'nysampoint', 'ny-zips_label', 'zip_polygon'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();



        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            if (clickedLayer == 'NY_ZIPCODES') {
                map.setLayoutProperty('ziplabel', 'visibility', 'none');
            }
            if (clickedLayer == 'nysampoint') {
                map.setLayoutProperty('nysamlabels', 'visibility', 'none');
            }
            if (clickedLayer == 'towns') {
                map.setLayoutProperty('townslabel', 'visibility', 'none');
            }
            if (clickedLayer == 'nyaddresscenter') {
                map.setLayoutProperty('nyaddresscenterlabels', 'visibility', 'none');
            }
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            if (clickedLayer == 'NY_ZIPCODES') {
                map.setLayoutProperty('ziplabel', 'visibility', 'visible');
            }
            if (clickedLayer == 'nyaddresscenter') {
                map.setLayoutProperty('nyaddresscenterlabels', 'visibility', 'visible');
            }
            if (clickedLayer == 'towns') {
                map.setLayoutProperty('townslabel', 'visibility', 'visible');
            }
            if (clickedLayer == 'nysampoint') {
                map.setLayoutProperty('nysamlabels', 'visibility', 'visible');
            }
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}




$('#showtable').click(function(e){
    $('#map').width('65%')
    $('#tablepanel').show();
    $('.geocodersdiv').animate({
        'left': "-15%" //moves left
    });

});
$('#hidetable').click(function(e) {
    $('#map').width('100%')
    $('#tablepanel').hide();
    $('.geocodersdiv').animate({
        'left': "0%" //moves left
    });

})


$('#street').keypress(function(e) {
    if (e.which == 13) { //Enter key pressed
        $('#streetbtn').click(); //Trigger search button click event
    }
});


$("#streetbtn").click(function() {
    getUser(ny_geocodes);
    function flyToStore(ny_geocodes) {
        if (map.getSource('single-points')) {
            map.removeLayer('geocodepoints');
            map.removeSource('single-points');
        }
        // var coords = [currentFeature.lon, currentFeature.lat];
        console.log(ny_geocodes)
        map.flyTo({
            center:[ny_geocodes[0]+0.0012,ny_geocodes[1]], //Move the center of the fly to 0.0012 degrees to the west to center in half screen
            zoom: 16.5
        });
        map.addSource('single-points', {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        });
        map.addLayer({
            "id": "geocodepoints",
            "source": "single-points",
            "type": "circle",
            "paint": {
                "circle-radius": 12,
                "circle-color": "red"
            }
        });
        var nypoint = {
            "type": "Point",
            "coordinates": ny_geocodes
        };
        map.getSource('single-points').setData(nypoint);
    };
    $('#streetbtn').html('Searching');


    async function getUser(ny_geocodes) {
        try {
        var street = document.getElementById('street').value;
          const response = await axios.get('https://gisservices.its.ny.gov/arcgis/rest/services/Locators/Street_and_Address_Composite/GeocodeServer/findAddressCandidates?Street=&City=&State=&ZIP=&SingleLine='+street+'&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json');          
          ny_geocodes=[];
          
          var json = response.data;
          ny_geocodes.push(json.candidates[0].location.x);
          ny_geocodes.push(json.candidates[0].location.y);
          $('#nyresult').html(JSON.stringify(json, null, 2));
          $('#streetbtn').html('Find Street Names');
          flyToStore(ny_geocodes);
        } catch (error) {
         $('#streetbtn').html('Find Street Names');
          console.error(error);
          $('#nyresult').html(error)
        }
      }


        // $.ajax({
    //     url: 'https://gisservices.its.ny.gov/arcgis/rest/services/Locators/Street_and_Address_Composite/GeocodeServer/findAddressCandidates?Street=&City=&State=&ZIP=&SingleLine='+street+'&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json'    ,
    //     success: function(result) {
    //         var json = JSON.parse(result);
    //         ny_geocodes.push(json.candidates[0].location.x);
    //         ny_geocodes.push(json.candidates[0].location.y);
    //         $('#nyresult').html(JSON.stringify(json, null, 2));
    //         console.log(ny_geocodes);
    //         $('#streetbtn').html('Find Street Names');
    //         // When the row is clicked from the datatable flyto function and point is added based off the lon and lat of the clicked row
    //         flyToStore(ny_geocodes);
    //     }
    // });
});































    // // // County Tile layer
    // map.addSource('county', {
    //     "type": "vector",
    //     "url": 'mapbox://jnb2387.65a0agqb'

    // });
    // map.addLayer({
    //     "id": "county",
    //     'type': 'fill',
    //     "source": 'county',
    //     'source-layer': 'countywgs84-2qsg7w',
    //     // 'minzoom':14,
    //     "layout": {
    //         'visibility': 'none',
    //     },
    //     "paint": {
    //         'fill-color': 'red',
    //         'fill-opacity': 0.5,
    //         'fill-outline-color': 'white'
    //     }
    // });
    // map.addLayer({
    //     'id': 'countylabel',
    //     'type': 'symbol',
    //     'source': 'county',
    //     "source-layer": "countywgs84-2qsg7w",
    //     "minzoom": 7,
    //     'layout': {
    //         'text-field': '{NAME} County',
    //         'text-size': 18,
    //         "symbol-spacing": 500000,
    //         "text-font": ["Open Sans Regular"],
    //         //"text-anchor": "center",
    //         //"text-justify": "center",
    //         'visibility': 'none'
    //     },
    //     'paint': {
    //         'text-color': 'black',
    //         'text-halo-color': 'red',
    //         'text-halo-width': 1.5
    //     }
    // });

    // // ZipCode Tile layer
    // map.addSource('zip', {
    //     "type": "vector",
    //     "url": 'mapbox://jnb2387.ct82c8j8'

    // });
    // // ZipCode label Tile layer
    // map.addLayer({
    //     'id': 'ziplabel',
    //     'type': 'symbol',
    //     'source': 'zip',
    //     "source-layer": "ny_zips-4vg7jg",
    //     "minzoom": 7,
    //     'layout': {
    //         'text-field': '{zip_code}',
    //         'text-size': 15,
    //         "symbol-spacing": 500000,
    //         "text-font": ["Open Sans Regular"],
    //         "text-anchor": "center",
    //         "text-justify": "center",
    //         'visibility': 'none'
    //     },
    //     'paint': {
    //         'text-color': 'white',
    //         'text-halo-color': 'blue',
    //         'text-halo-width': 1.5
    //     }
    // });
    // map.addLayer({
    //     "id": "NY_ZIPCODES",
    //     "type": "line",
    //     "source": 'zip',
    //     'source-layer': 'ny_zips-4vg7jg',
    //     "layout": {
    //         "line-join": "round",
    //         "line-cap": "round",
    //         'visibility': 'none'

    //     },
    //     "paint": {
    //         "line-color": "blue",
    //         "line-width": 2
    //     }
    // });