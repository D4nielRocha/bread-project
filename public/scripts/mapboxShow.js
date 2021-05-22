const mapCoordinates = JSON.parse(strBread).geometry.coordinates || [53.31957532907056, -6.268388557204144];


mapboxgl.accessToken = token;
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
center: mapCoordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

var marker2 = new mapboxgl.Marker({ color: 'red', draggable: true, rotation: 0 })
.setLngLat(mapCoordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<p>Bread: ${JSON.parse(strBread).title}</p>`
    )
)
.addTo(map)

// 53.31957532907056, -6.268388557204144

