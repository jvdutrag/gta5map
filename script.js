const center_x = 117.3;
const center_y = 172.8;
const scale_x = 0.02072;
const scale_y = 0.0205;

CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale: function(zoom) {

        return Math.pow(2, zoom);
    },
    zoom: function(sc) {

        return Math.log(sc) / 0.6931471805599453;
    },
	distance: function(pos1, pos2) {
        var x_difference = pos2.lng - pos1.lng;
        var y_difference = pos2.lat - pos1.lat;
        return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
    },
	transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
    infinite: true
});

var AtlasStyle	= L.tileLayer('mapStyles/styleAtlas/{z}/{x}/{y}.jpg', {minZoom: 0,maxZoom: 5,noWrap: true,continuousWorld: false,attribution: 'GTA V MAP', id: 'styleAtlas map',})

var map = L.map('map', {
    crs: CUSTOM_CRS,
    minZoom: 1,
    maxZoom: 5,
    Zoom: 5,
    maxNativeZoom: 5,
    preferCanvas: true,
    layers: [AtlasStyle],
    center: [0, 0],
    zoom: 3,
});

let clickEnable = false

map.on('click', function(e) {
    if (!clickEnable) {
        return;
    }

    // remove all old markers before adding a new one
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    const x = e.latlng.lng;
    const y = e.latlng.lat;

    const text = `<strong>X:</strong> ${x}<br><strong>Y:</strong> ${y}`

    new L.marker(e.latlng).addTo(map).bindPopup(text);
});

document.addEventListener("DOMContentLoaded", function() {
    let params = (new URL(document.location)).searchParams;

    let x = Number(params.get("x"));
    let y = Number(params.get("y"));

    if (x && y) {
        map.setView([y, x], 4);
        L.marker([y,x]).addTo(map).bindPopup('Localização');
    } else {
        clickEnable = true;
    }
});

