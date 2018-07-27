mapboxgl.accessToken = 'pk.eyJ1Ijoiam5iMjM4NyIsImEiOiJjamZ4MWM3MmYwdnRlMzNuMTdybjNiMGZkIn0.XNRMd-IS-iN1yiSPaOY-Cg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jnb2387/cjiwfye5d1ls82rpmkrjsnac8?optimize=true',
    zoom: 6,
    center: [-76.249, 42.958],
    hash: true,
});
map.addControl(new mapboxgl.NavigationControl());



var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox: [-80.0744, 40.3977, -72.4389, 44.9656],
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
var ny_geocodes = [];
var coords;
var popup; // SO WE CAN GRAB THE POPUP FROM ANYWHERE
var datatable;
var dataArr = [];
var latlonpopup;

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

// // Disable default box zooming.
// map.boxZoom.disable();

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: false
});


map.on('load', function () {
    //FUNCTION FOR COPYING THE LAT AND LON FROM A MAP CLICK
    map.on('click', function (e) {
        $('#listings').hide();
        if (map.getZoom() > 14) {
            var features = map.queryRenderedFeatures({ layers: ['NY_Street'] });
            latlonpopup = new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.lngLat.lng + " <button id='lng' class='copybtn btn round'>Copy Lon</button><br>" + e.lngLat.lat + " <button class='copybtn btn round' id='lat'>Copy Lat</button>")
                .addTo(map);
            $(document).on('click', '#lng', function () {
                $('#lat').html("Copy");
                $('#lng').html("Copied");

                copyToClipboard(e.lngLat.lng);
            });
            $(document).on('click', '#lat', function () {
                $('#lng').html("Copy");
                $('#lat').html("Copied");
                copyToClipboard(e.lngLat.lat);
            });
            function copyToClipboard(elementId) {
                var aux = document.createElement("input");// Create a "hidden" input
                aux.setAttribute("value", elementId);// Assign it the value of the specified element
                document.body.appendChild(aux); // Append it to the body
                aux.select();// Highlight its content
                document.execCommand("copy");// Copy the highlighted text
                document.body.removeChild(aux);// Remove it from the body
            }
        }
    });
    // END MAP CLICK LAT LON






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
    geocoder.on('result', function (ev) {
        if (latlonpopup) {
            latlonpopup.remove()
        } //REMOVE ANY POPUPS ON MAP

        map.getSource('single-point').setData(ev.result.geometry);
    });
  

}); // END MAP LOAD


var toggleableLayerIds = ['County','NY-Addresses', 'NY-Zipcodes'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;
    //Because these two layers are not visible when first loaded
    if (id === 'County' || id === 'NY-Zipcodes') {
        link.className = '';
    }
    

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        var maplayers = map.getStyle().layers;
        maplayers.map(function (name) {
            // console.log(name.id)
        })
        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            if (clickedLayer == 'County') {
                map.setLayoutProperty('County', 'visibility', 'none');
                map.setLayoutProperty('county_labels', 'visibility', 'none');
            }
            if (clickedLayer == 'NY-Zipcodes') {
                map.setLayoutProperty('ny-zips_label', 'visibility', 'none');
                map.setLayoutProperty('ny-zips_outline', 'visibility', 'none');
            } 
            if (clickedLayer == 'NY-Addresses') {
                map.setLayoutProperty('ny-add_label', 'visibility', 'none');
            }
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            if (clickedLayer == 'County') {
                map.setLayoutProperty('County', 'visibility', 'visible');
                map.setLayoutProperty('county_labels', 'visibility', 'visible');
            }
            if (clickedLayer == 'NY-Zipcodes') {
                map.setLayoutProperty('ny-zips_label', 'visibility', 'visible');
                map.setLayoutProperty('ny-zips_outline', 'visibility', 'visible');

            }
            if (clickedLayer == 'NY-Addresses') {
                map.setLayoutProperty('ny-add_label', 'visibility', 'visible');
            }
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}




$('#showtable').click(function (e) {
    $('#map').width('65%')
    $('#tablepanel').show();
    $('.geocodersdiv').animate({
        'left': "-15%" //moves left
    });

});
$('#hidetable').click(function (e) {
    $('#map').width('100%')
    $('#tablepanel').hide();
    map.resize();
    $('.geocodersdiv').animate({
        'left': "0%" //moves left
    });

})


$('#street').keypress(function (e) {
    if (e.which == 13) { //Enter key pressed
        $('#streetbtn').click(); //Trigger search button click event
    }
});


$("#streetbtn").click(function () {
    getUser();
    $('#table tbody').html('')// CLEAR THE TABLE BODY
    dataArr = [];// CLEAR THE GEOCODED RESULTS
    $('#streetbtn').html('Searching');
    // console.log(map.getStyle().layers)

    async function getUser() {
        try {
            var street = document.getElementById('street').value;
            const response = await axios.get('https://gisservices.its.ny.gov/arcgis/rest/services/Locators/Street_and_Address_Composite/GeocodeServer/findAddressCandidates?Street=&City=&State=&ZIP=&SingleLine=' + street + '&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json');
            ny_geocodes = [];
            var json = response.data;
            ny_geocodes.push(json.candidates[0].location.x);
            ny_geocodes.push(json.candidates[0].location.y);
            $('#streetbtn').html('Find Address');
            $.each(response, function(index, candidates) {
                dataArr.push(candidates.candidates);
            });
            datatable = $("#table").DataTable({
                data: dataArr[0],
                destroy: true,
                select: true,
                // dataSrc: "",
                columns: [{
                    data: "address"
                }
                , {
                    data: "score"
                }
                , {
                    data: "attributes.Loc_name"
                }
                ],              
                autoWidth: false,
                "jQueryUI": true,//nothing
                'table-hover':true,//nothing
                scrollY: "75vh",
                scrollX: "100%",
                search: {
                    caseInsensitive: true
                },
                paging: true,
                info: true,
                lengthMenu: [19, 50, 100]
            });
            datatable.order([1,'desc']).draw() // ORDER THE TABLE BY SCORE
            
            $('#table tbody')
            .on( 'mouseenter', 'td', function () {
                var colIdx = datatable.cell(this).index().column;
    
                // $( datatable.cells().nodes() ).removeClass( 'highlight' );
                // $( datatable.column( colIdx ).nodes() ).addClass( 'highlight' );
            } );
           
            $('#table tbody').on('click', 'tr', function() {
                var clickedaddress = [];
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');

                } else {
                    $('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    var ids = $.map(datatable.rows('.selected').data(), function(item) {
                        console.log(item)
                        var coords = [item.location.x, item.location.y]; //set the coords to the lon and lat field of the clicked row.
                        flyToStore(coords); //Run the flyToStore functions with the clicked item properties
                        var filterstreet = item.attributes.StreetName +' '+ item.attributes.SufType
                        map.setLayoutProperty('NY_Street', 'visibility', 'visible');
                        map.setFilter('NY_Street',['==','Label',filterstreet]);
                        map.setLayoutProperty('NY_Street_Label', 'visibility', 'visible');
                        map.setFilter('NY_Street_Label',['==','Label',filterstreet]);
                        console.log(filterstreet)

                    });

                }
            });
            // flyToStore(ny_geocodes);
            // console.log(map.getFilter('NY-Street'))
        } catch (error) {
            $('#streetbtn').html('Find Address');
            $('#table tbody').html('No Address Found, Try Adding Zipcode or NY')
        }
    }
});
function flyToStore(ny_geocodes) {
    if (map.getSource('single-points')) {
        map.removeLayer('geocodepoints');
        map.removeSource('single-points');
    }
    // var coords = [currentFeature.lon, currentFeature.lat];
    console.log(ny_geocodes)
    map.flyTo({
        center: [ny_geocodes[0] + 0.0012, ny_geocodes[1]], //Move the center of the fly to 0.0012 degrees to the west to center in half screen
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