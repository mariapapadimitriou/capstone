
mapboxgl.accessToken = "pk.eyJ1IjoibWFyaWFwYXBhZGltaXRyaW91IiwiYSI6ImNreGF6eThsNjJyb2szMHBtbWplc2Z6dWoifQ.Em5B1yYl9AT6jPMlmM1b4w";

    
const map = new mapboxgl.Map({
container: 'app', // container ID
style: 'mapbox://styles/mariapapadimitriou/ckxrxguwp2ymn14nm3oyyezl9', // style URL
center: [-79.3923, 43.6643], // starting position [lng, lat]
zoom: 12, // starting zoom
maxBounds: [-79.644849,43.553266,-79.068067,43.849127]
});

  const draw = new MapboxDraw({
    // Instead of showing all the draw tools, show only the line string and delete tools.
    displayControlsDefault: false,
    controls: {
      line_string: true,
      trash: true,
    },
    // Set the draw mode to draw LineStrings by default.
    defaultMode: 'simple_select',
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

  const colours = ['#36b9cc', "#B026FF", "#1cc88a"];
  var id_colours = {};
  var id_coords = {};

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
        
        getMatch(newCoords, radius, profile, routeid);
      }
    }
  }

function updateRoute() {
    // Set the profile

    const profile = 'driving';
    // Get the coordinates that were drawn on the map

    const data = draw.getSelected();

    const coords = data.features[0].geometry.coordinates;
    // Format the coordinates
    const newCoords = coords.join(';');
    // Set the radius for each coordinate pair to 25 meters
    const radius = coords.map(() => 25);

    const routeid = draw.getSelectedIds()[0]

    if (typeof map.getLayer(routeid) !== 'undefined') {
      map.removeLayer(routeid)
      map.removeSource(routeid)
      getMatch(newCoords, radius, profile, routeid);
    }
  }


// Make a Map Matching request
async function getMatch(coordinates, radius, profile, routeid) {
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
    draw.delete(routeid)
    delete id_colours[routeid]
    updateLegend()
    return;
  }
  // Get the coordinates from the response
  const coords = response.matchings[0].geometry;
  // Draw the route on the map
  
  addRoute(coords, routeid);
}


function getValues(dic) {
  var vals = []
  for (var key in dic) {
    vals.push(dic[key])
  }
  return vals
}

function getKeys(dic) {
  var keys = []
  for (var key in dic) {
    keys.push(key)
  }
  return keys
}

function getNewColour() {
  const touse = colours.filter(x => !getValues(id_colours).includes(x))[0]
  return touse
}

// Draw the Map Matching route as a new layer on the map
function addRoute(coords, routeid) {
      // Add a new layer to the map

      if (typeof(id_colours[routeid]) != 'undefined') {
        var c = id_colours[routeid]
        
      }
      else {
        var c = getNewColour()
        id_colours[routeid] = c
      }
    
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
          'line-color': id_colours[routeid],
          'line-width': 4,
          'line-opacity': 1
        }
      });
      
      id_coords[routeid] = coords

      updateLegend()
  }

  function removeRoute(routeid) {
    const id = routeid.features[0].id
    if (!map.getSource(id)) return;
    map.removeLayer(id);
    map.removeSource(id);
    
    delete id_colours[id]
    delete id_coords[id]

    if (draw.getAll().features.length == 0) {
      
      document.getElementById('legend').innerHTML = "";
      
      var share = [0,0,0];
      var strip = [0,0,0];
      var protect = [0,0,0];
      updateCharts()
    }
    else {
      updateLegend()
      updateCharts()
    }
    

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
map.addControl(new mapboxgl.NavigationControl());

var routes = []
function updateLegend() {

  const answer = document.getElementById('legend');
  var routes = []

  routes.push("<div class='row'><div class='col'>")


  if (draw.getAll().features.length >= 1) {
    for (let i = 0; i < draw.getAll().features.length; i++) {
      const routeid = draw.getAll().features[i].id

      routes.push("<div class='row'><span style='margin-left: 10px; color:")
      routes.push(id_colours[routeid])
      routes.push(";'>")
      routes.push("<b>Route")
      routes.push(i+1)
      routes.push("</b>&nbsp;&nbsp;&nbsp;" + roundToTwo(turf.length(id_coords[routeid])) + "km</span></div>")
      routes.push("<div style='height:10px'></div>")
      routes.push("<div class='row' style='display: flex; justify-content: space-between; margin-right: 1px; margin-left: -5px; margin-right: 5px;'>")
      routes.push("<button class='buttonmode' id ='share" + i + "' type='submit' onclick='selectOption(this.id)'>Sharrows &nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i></button>")
      routes.push("<button class='buttonmode' type='submit' id ='strip" + i + "' onclick='selectOption(this.id)'>Striped &nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i></button>")
      routes.push("<button class='buttonmode' type='submit' id ='protect" + i + "' onclick='selectOption(this.id)'>Protected &nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i></button>")
      routes.push("</div>")
      routes.push("<div style='height:20px'></div>")
    }
    routes.push("</div><div style='height:20px'></div>")
    answer.innerHTML = routes.join(" ");
  }
  else {

    answer.innerHTML = "";
  }

  if (draw.getAll().features.length == 3) {
    var drawLine = document.getElementsByClassName('mapbox-gl-draw_line');
    var newdrawline = document.getElementById('hey');

    drawLine[0].disabled = true;
    newdrawline.disabled = true;
    
    drawLine[0].classList.add('disabled-button');
    newdrawline.classList.add('hey-disabled');

    newdrawline.innerHTML = "Add New Route&nbsp;&nbsp;<i class='fas fa-ban'></i>"

  }
  
  else {
    var drawLine = document.getElementsByClassName('mapbox-gl-draw_line');
    var newdrawline = document.getElementById('hey');

    drawLine[0].disabled = false;
    newdrawline.disabled = false;

    drawLine[0].classList.remove('disabled-button');
    newdrawline.classList.remove('hey-disabled');

    newdrawline.innerHTML = "Add New Route&nbsp;&nbsp;<i class='fas fa-plus-circle'></i>"
  }

  share = [0,0,0];
  strip = [0,0,0];
  protect = [0,0,0];

  updateButtons()
  updateCharts()

}

function updateButtons() {

  const share1 = document.getElementById("share0")
  const share2 = document.getElementById("share1")
  const share3 = document.getElementById("share2")

  if (share1 != null) {
    share1.click()
  }
  if (share2 != null) {
    share2.click()
  }
  if (share3 != null) {
    share3.click()
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

    const total_clicked = (arraySum(share) + arraySum(strip) + arraySum(protect))

    if ((count == 0) & (total_clicked <= 2)) {
      property.style.backgroundColor = "black"
      property.style.color = "white"
      type_map[type][routeid] = 1;
      property.innerHTML = type_full[type] + "&nbsp;&nbsp;&nbsp;<i class='fas fa-check'></i>"
    }
    else {
      property.style.backgroundColor = "white"
      property.style.color = "black"
      type_map[type][routeid] = 0;        
      property.innerHTML = type_full[type] + "&nbsp;&nbsp;&nbsp;<i class='fa fa-plus-circle'></i>"
    }
    updateCharts()
}

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function arraySum(array) {
    var sum = 0
    for (let i=0; i < array.length; i++) {
      sum += array[i]
    }
    return sum
  }

  document.getElementById('hey').onclick = function () {
    draw.changeMode('draw_line_string');
}

var data = {}

function updateCharts(){
  
  var c = []
  var coords = []
  var arr_length = []

  for (let i = 0; i < draw.getAll().features.length; i++) {
  
    var routeid = draw.getAll().features[i].id
    c.push(id_colours[routeid])  
    coords.push(id_coords[routeid].coordinates)
    arr_length.push(turf.length(id_coords[routeid]))
  }

  data = {
    "routetypes": {'sharrows': share, "striped": strip, "protected": protect},
    "colours": c,
    "coordinates": coords,
    "length": arr_length,
    "overrides": {
      "cost_sharrows": [sliderOne.value, sliderTwo.value], 
      "riders": [sliderRide1.value, sliderRide2.value],
      "modal_shift": [sliderModal1.value, sliderModal2.value],
      "cost_protected": [sliderOne_protect.value, sliderTwo_protect.value],
      "cost_striped": [sliderOne_striped.value, sliderTwo_striped.value],
      "emissions": [sliderEm1.value, sliderEm2.value]
    }
  }

  var new_colours = []

  $.ajax({
    type: "POST",
    url: "/hi",
    data: data,
    dataType: 'json',
    success: function(data) {

      var plot_colours = data["colours_plot"]
      var labels_plot = data["labels_plot"]
      var cost_data = data["cost_data"]
      var ridership_data = data["ridership_data"]
      var emissions_data = data["emissions_data"]
      //var traffic_data = data["traffic_data"]
      var safety_data = data["safety_data"]
      var multi_data = data["multi_data"]

      for (let i = 0; i < plot_colours.length; i++) {
        if (new_colours.includes(pSBC(-0.5, plot_colours[i]))) {
          new_colours.push(pSBC(-0.8, plot_colours[i]))
        }
        else if (new_colours.includes(plot_colours[i])) {
          new_colours.push(pSBC(-0.5, plot_colours[i]))
        }
        else {
          new_colours.push(plot_colours[i])
        }
      }
      
      //getTrafficPlot(new_colours, labels_plot, traffic_data)
      getCostPlot(new_colours, labels_plot, cost_data)
      getRidershipPlot(new_colours, labels_plot, ridership_data)
      getEmissionsPlot(new_colours, labels_plot, emissions_data)
      getSafetyPlot(new_colours, labels_plot, safety_data)
      getMultiObjective(new_colours, labels_plot, multi_data)

    }
  });

}

// RANDOM FUNCTIONS

const pSBC=(p,c0,c1,l)=>{
  let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
  if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
  if(!this.pSBCr)this.pSBCr=(d)=>{
      let n=d.length,x={};
      if(n>9){
          [r,g,b,a]=d=d.split(","),n=d.length;
          if(n<3||n>4)return null;
          x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
      }else{
          if(n==8||n==6||n<4)return null;
          if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
          d=i(d.slice(1),16);
          if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
          else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
      }return x};
  h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
  if(!f||!t)return null;
  if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
  else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
  a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
  if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
  else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};



