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
<<<<<<< HEAD
var popup; // SO WE CAN GRAB THE POPUP FROM ANYWHERE

=======
var latlonpopup; // SO WE CAN GRAB THE POPUP FROM ANYWHERE
var datatable;
var dataArr = [];
>>>>>>> aca968ef94c8fbd3caba5856616721be5113288f

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
<<<<<<< HEAD

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


=======
    
//////=======================STREET SELECTION BOX
    map.addLayer({
        "id": "streets-highlighted",
        "type": "line",
        "source": "tilehut",
        "source-layer": "nystreets",
        "paint": {
            "line-color": "yellow",
            "line-width": 2,
            "line-opacity": 0.75
        },
        "filter": ["in", "Label", ""]
    },'streetlabels');

    map.addLayer(
        {
            "id": "streethighlightlabels",
            "type": "symbol",
            "source": "tilehut",
            "source-layer": "nystreets",
            "minzoom": 9,
            "filter": ["in", "Label", ""],
            "layout": {
                "visibility": "visible",
                "text-field": "{Label}",
                "text-font": [
                    "DIN Offc Pro Bold",
                    "Arial Unicode MS Regular"
                ],
                "text-ignore-placement":true,
                "text-allow-overlap": true,
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            9,
                            12
                        ],
                        [
                            20,
                            18
                        ]
                    ]
                },
                "symbol-placement": "line",
                // "text-max-angle": 30,
                // "text-rotation-alignment": "map",
                // "text-padding": 1
            },
            "paint": {
                "text-color": "#fff",
                "text-halo-color": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            "blue"
                        ],
                        [
                            16,
                            "yellow"
                        ]
                    ]
                },
                "text-halo-width": {
                    "base": 1,
                    "stops": [
                        [
                            14,
                            1
                        ],
                        [
                            15,
                            1
                        ]
                    ]
                }
            }
        });
        // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    canvas.addEventListener('mousedown', mouseDown, true);

    
        // Return the xy coordinates of the mouse position
        function mousePos(e) {
            var rect = canvas.getBoundingClientRect();
            return new mapboxgl.Point(
                e.clientX - rect.left - canvas.clientLeft,
                e.clientY - rect.top - canvas.clientTop
            );
        }
    
        function mouseDown(e) {
            // Continue the rest of the function if the shiftkey is pressed.
            if (!(e.shiftKey && e.button === 0)) return;
    
            // Disable default drag zooming when the shift key is held down.
            map.dragPan.disable();
    
            // Call functions for the following events
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('keydown', onKeyDown);
    
            // Capture the first xy coordinates
            start = mousePos(e);
        }
    
        function onMouseMove(e) {
            // Capture the ongoing xy coordinates
            current = mousePos(e);
    
            // Append the box element if it doesnt exist
            if (!box) {
                box = document.createElement('div');
                box.classList.add('boxdraw');
                canvas.appendChild(box);
            }
    
            var minX = Math.min(start.x, current.x),
                maxX = Math.max(start.x, current.x),
                minY = Math.min(start.y, current.y),
                maxY = Math.max(start.y, current.y);
    
            // Adjust width and xy position of the box element ongoing
            var pos = 'translate(' + minX + 'px,' + minY + 'px)';
            box.style.transform = pos;
            box.style.WebkitTransform = pos;
            box.style.width = maxX - minX + 'px';
            box.style.height = maxY - minY + 'px';
        }
    
        function onMouseUp(e) {
            // Capture xy coordinates
            finish([start, mousePos(e)]);
        }
    
        function onKeyDown(e) {
            // If the ESC key is pressed
            if (e.keyCode === 27) finish();
        }
    
        function finish(bbox) {
            // Remove these events now that finish has been called.
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mouseup', onMouseUp);
    
            if (box) {
                box.parentNode.removeChild(box);
                box = null;
            }
    
            // If bbox exists. use this value as the argument for `queryRenderedFeatures`
            if (bbox) {
                var features = map.queryRenderedFeatures(bbox, { layers: ['streets','streetlabels'] });
    
                if (features.length >= 1000) {
                    return window.alert('Select a smaller number of features');
                }
    
                // Run through the selected features and set a filter
                // to match features with unique FIPS codes to activate
                // the `counties-highlighted` layer.
                var filter = features.reduce(function(memo, feature) {
                    memo.push(feature.properties.Label);
                    return memo;
                }, ['in', 'Label']);
                filter = filter.filter(function(n){return n !=undefined})//For some reason if the label is undefined it wont work so get them out of the array
                
                map.setFilter("streets-highlighted", filter);
                map.setFilter("streethighlightlabels", filter);
                var notfilter = filter.splice(0,1,"!in")
                console.log(notfilter)
                map.setFilter("streetlabels",filter)
            }
    
            map.dragPan.enable();
        }
    
        map.on('mousemove', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['streets-highlighted'] });
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    
            if (!features.length) {
                popup.remove();
                return;
            }
    
            var feature = features[0];
    
            popup.setLngLat(e.lngLat)
                .setText(feature.properties.Label)
                .addTo(map);
        });
////------END SELECTION BOX-----------------------------------=========================
>>>>>>> aca968ef94c8fbd3caba5856616721be5113288f



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
<<<<<<< HEAD
}); // END MAP LOAD


var toggleableLayerIds = ['nyaddresscenter', 'nysampoint', 'ny-zips_label', 'zip_polygon'];
=======




    map.on('click', 'county', function(e) {
        if (map.getZoom() < 15) {

        var coordinates = e.features[0].geometry.coordinates;
        var description = e.features[0].properties.NAME;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);
        }
    });


    map.on('click', function(e) {
        $('#listings').hide();
        if (map.getZoom() > 14) {

            latlonpopup = new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.lngLat.lng + " <button id='lng' class='copybtn'>Copy</button><br>" + e.lngLat.lat + " <button class='copybtn' id='lat'>Copy</button>") //+"<br>"+e.lngLat.lat +" <button id='lat' onclick="+copyToClipboard(e.lngLat.lat)+">Copy</button>") 
                .addTo(map);
            $(document).on('click', '#lng', function() {
                $('#lat').html("Copy");
                $('#lng').html("Copied");

                copyToClipboard(e.lngLat.lng);
            });
            $(document).on('click', '#lat', function() {
                $('#lng').html("Copy");
                $('#lat').html("Copied");
                copyToClipboard(e.lngLat.lat);
            });

        }
    });


}); // END MAP LOAD


var toggleableLayerIds = ['nyaddresscenter', 'nysampoint', 'towns'];
>>>>>>> aca968ef94c8fbd3caba5856616721be5113288f

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

<<<<<<< HEAD
=======
    //Because these two layers are not visible when first loaded
    if (id === 'towns' || id === 'NY_ZIPCODES') {
        link.className = '';
    }


>>>>>>> aca968ef94c8fbd3caba5856616721be5113288f
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
<<<<<<< HEAD
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
=======
    $('#streetbtn').html('Searching');
    if ($('#table td').is(':visible')) {
        dataArr = [];
    }
    var street = document.getElementById('street').value;
    $.ajax({
        url: 'https://nyapi.herokuapp.com/bbox/v1/{table}?address=' + street,
        success: function(result) {
            $('#streetbtn').html('Find Street Names');
            $.each(result, function(index, property) {
                dataArr.push(property);
            });

            datatable = $("#table").DataTable({
                data: dataArr,
                destroy: true,
                dataSrc: "",
                columns: [{
                    data: "address"
                }, {
                    data: "lon"
                }, {
                    data: "lat"
                }],
                "select": true,
                autoWidth: false,
                scrollY: "80vh",
                scrollX: "100%",
                "jQueryUI": true,
                search: {
                    caseInsensitive: true
                },
                paging: true,
                info: true,
                lengthMenu: [20, 50, 100]
            });

            $('#table tbody').on('click', 'tr', function() {
                console.log(this);
                var clickedaddress = [];
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');

                } else {
                    $('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    var ids = $.map(datatable.rows('.selected').data(), function(item) {
                        var coords = [item.lon, item.lat]; //set the coords to the lon and lat field of the clicked row.
                        flyToStore(item); //Run the flyToStore functions with the clicked item properties

                    });

                }
            });



            //When the row is clicked from the datatable flyto function and point is added based off the lon and lat of the clicked row
            function flyToStore(currentFeature) {
                if(latlonpopup){latlonpopup.remove();}
                if (map.getSource('single-points')) {
                    map.removeLayer('geocodepoints');
                    map.removeSource('single-points');
                }
                var coords = [currentFeature.lon, currentFeature.lat];
                map.flyTo({
                    center: [coords[0] + 0.0012, coords[1]], //Move the center of the fly to 0.0013 degrees to the west to center in half screen
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
                }, 'nysamlabels');
                var nypoint = {
                    "type": "Point",
                    "coordinates": coords
                };
                map.getSource('single-points').setData(nypoint);
>>>>>>> aca968ef94c8fbd3caba5856616721be5113288f
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