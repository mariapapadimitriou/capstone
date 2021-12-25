
mapboxgl.accessToken = "pk.eyJ1IjoibWFyaWFwYXBhZGltaXRyaW91IiwiYSI6ImNreGF6eThsNjJyb2szMHBtbWplc2Z6dWoifQ.Em5B1yYl9AT6jPMlmM1b4w";

const geojson = {
    "version": 0.6,
    "generator": "Overpass API 0.7.57.1 74a55df1",
    "osm3s": {
      "timestamp_osm_base": "2021-11-16T16:06:44Z",
      "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."
    },
    "elements": [
        {
            "type": "node",
            "id": 20979738,
            "lat": 43.6659368,
            "lon": -79.3918763,
            "tags": {
              "button_operated": "yes",
              "crossing": "traffic_signals",
              "highway": "traffic_signals"
            }
          },
          {
            "type": "node",
            "id": 20979746,
            "lat": 43.6651098,
            "lon": -79.3939147,
            "tags": {
              "crossing": "traffic_signals",
              "highway": "crossing"
            }
          },
          {
            "type": "node",
            "id": 20979760,
            "lat": 43.6575265,
            "lon": -79.3896244,
            "tags": {
              "highway": "traffic_signals"
            }
          }
    ]};
    
const map = new mapboxgl.Map({
container: 'app', // container ID
style: 'mapbox://styles/mapbox/light-v9', // style URL
center: [-79.347015, 43.651070], // starting position [lng, lat]
zoom: 12, // starting zoom
maxBounds: [-79.644849,43.553266,-79.068067,43.849127]
});

  // add markers to map
  for (const feature of geojson.elements) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el, {
      draggable: false,

    }).setLngLat([feature.lon, feature.lat]).addTo(map);
  }
  

  const draw = new MapboxDraw({
    // Instead of showing all the draw tools, show only the line string and delete tools.
    displayControlsDefault: false,
    controls: {
      line_string: true,
      trash: true
    },
    // Set the draw mode to draw LineStrings by default.
    defaultMode: 'draw_line_string',
    styles: [
      // Set the line style for the user-input coordinates.
      {
        id: 'gl-draw-line',
        type: 'line',
        filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': 'black',
          'line-dasharray': [0.2, 2],
          'line-width': 4,
          'line-opacity': 0.7
        }
      },
      // Style the vertex point halos.
      {
        id: 'gl-draw-polygon-and-line-vertex-halo-active',
        type: 'circle',
        filter: [
          'all',
          ['==', 'meta', 'vertex'],
          ['==', '$type', 'Point'],
          ['!=', 'mode', 'static']
        ],
        paint: {
          'circle-radius': 12,
          'circle-color': '#FFF'
        }
      },
      // Style the vertex points.
      {
        id: 'gl-draw-polygon-and-line-vertex-active',
        type: 'circle',
        filter: [
          'all',
          ['==', 'meta', 'vertex'],
          ['==', '$type', 'Point'],
          ['!=', 'mode', 'static']
        ],
        paint: {
          'circle-radius': 8,
          'circle-color': 'black'
        }
      }
    ]
  });

  const num_routes = 0;
  const colours = ['#36b9cc', "#4e73df", "#1cc88a"];
  var id_colours = {};

  function createRoute() {
    // Set the profile
    const profile = 'driving';
    // Get the coordinates that were drawn on the map

    const data = draw.getAll();
    const lastFeature = data.features.length - 1;
    const coords = data.features[lastFeature].geometry.coordinates;
    // Format the coordinates
    const newCoords = coords.join(';');
    // Set the radius for each coordinate pair to 25 meters
    const radius = coords.map(() => 25);

    for (let i = 0; i < draw.getAll().features.length; i++) {
      const routeid = draw.getAll().features[i].id
      const routeidx = i

      if (typeof map.getLayer(routeid) == 'undefined') {
        
        getMatch(newCoords, radius, profile, routeid, routeidx);
      }
    }
  }

function updateRoute() {
    // Set the profile

    const profile = 'cycling';
    // Get the coordinates that were drawn on the map

    const data = draw.getAll();
    const lastFeature = data.features.length - 1;

    const coords = data.features[lastFeature].geometry.coordinates;
    // Format the coordinates
    const newCoords = coords.join(';');
    // Set the radius for each coordinate pair to 25 meters
    const radius = coords.map(() => 25);

    const routeid = draw.getAll().features[lastFeature].id

    if (typeof map.getLayer(routeid) !== 'undefined') {
      map.removeLayer(routeid)
      map.removeSource(routeid)
      getMatch(newCoords, radius, profile, routeid, lastFeature);
    }
  }


// Make a Map Matching request
async function getMatch(coordinates, radius, profile, routeid, routeidx) {
  // Separate the radiuses with semicolons
  const radiuses = radius.join(';');
  // Create the query
  const query = await fetch(
    `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const response = await query.json();
  // Handle errors
  if (response.code !== 'Ok') {
    alert(
      `${response.code} - ${response.message}.\n\nPlease input a valid route near a road.`
    );
    return;
  }
  // Get the coordinates from the response
  const coords = response.matchings[0].geometry;
  // Draw the route on the map
  
  addRoute(coords, routeid, routeidx);
}

// Draw the Map Matching route as a new layer on the map
function addRoute(coords, routeid, routeidx) {
      // Add a new layer to the map

      map.addLayer({
        id: routeid,
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: coords
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'visible',
        },
        paint: {
          'line-color': colours[routeidx],
          'line-width': 4,
          'line-opacity': 1
        }
      });
      id_colours[routeid] = colours[routeidx]
      updateLegend()
  }

  function removeRoute(routeid) {
    const id = routeid.features[0].id
    if (!map.getSource(id)) return;
    map.removeLayer(id);
    map.removeSource(id);
    updateLegend()
  }

  map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        bbox: [-79.644849,43.553266,-79.068067,43.849127], // Boundary for Toronto
    }),
    "top-right"
);

    // Add the draw tool to the map.
  map.addControl(draw);

  map.on('draw.create', createRoute);
  map.on('draw.update', updateRoute);
  map.on('draw.delete', removeRoute);

map.addControl(new mapboxgl.FullscreenControl());

function updateLegend() {

  const answer = document.getElementById('legend');
  var routes = []

  routes.push("<div class='row'>")

  if (draw.getAll().features.length >= 1) {
    for (let i = 0; i < draw.getAll().features.length; i++) {
      const routeid = draw.getAll().features[i].id

      routes.push("<div class='col-4'><span style='color:")
      routes.push(id_colours[routeid])
      routes.push(";'>")
      routes.push("<b>Route")
      routes.push(i+1)
      routes.push("</b></span>")
      routes.push("<div style='height: 10px;'></div>")
      routes.push("<button class='buttonmode' id ='share" + i + "' type='button' onclick=selectOption(this.id)>Sharrows &nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i></button>")
      routes.push("<div style='height: 10px;'></div>")
      routes.push("<button class='buttonmode' type='button' id ='strip" + i + "' onclick=selectOption(this.id)>Striped &nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i></button>")
      routes.push("<div style='height: 10px;'></div>")
      routes.push("<button class='buttonmode' type='button' id ='protect" + i + "' onclick=selectOption(this.id)>Protected &nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i></button>")
      routes.push("</div>")
    }
    routes.push("</div>")
    answer.innerHTML = routes.join(" ");
  }
  else {

    answer.innerHTML = "";
  }

  if (draw.getAll().features.length == 3) {
    var drawLine = document.getElementsByClassName('mapbox-gl-draw_line');
    drawLine[0].disabled = true;
    drawLine[0].classList.add('disabled-button');
  }
  else {
    var drawLine = document.getElementsByClassName('mapbox-gl-draw_line');
    drawLine[0].disabled = false;
    drawLine[0].classList.remove('disabled-button');
  }
}

var share = [0,0,0];
var strip = [0,0,0];
var protect = [0,0,0];

function selectOption(btn) {
    var property = document.getElementById(btn);

    var type_map = {"share" : share, "strip" : strip, "protect" : protect}
    const type_full = {"share" : "Sharrows", "strip" : "Striped", "protect" : "Protected"}

    const type = btn.slice(0, -1)
    const routeid = btn.charAt(btn.length-1)

    var count = type_map[type][routeid]

    if (count == 1) {
        property.style.backgroundColor = "white"
        property.style.color = "#5a5c69"
        type_map[type][routeid] = 0;        
        property.innerHTML = type_full[type] + "&nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i>"
    }
    else {
        property.style.backgroundColor = "#5a5c69"
        property.style.color = "white"
        type_map[type][routeid] = 1;
        property.innerHTML = type_full[type] + "&nbsp;&nbsp;&nbsp;<i class='fas fa-check'></i>"
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  