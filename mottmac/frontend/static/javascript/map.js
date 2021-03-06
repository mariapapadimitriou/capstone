mapboxgl.accessToken = "pk.eyJ1IjoibWFyaWFwYXBhZGltaXRyaW91IiwiYSI6ImNreGF6eThsNjJyb2szMHBtbWplc2Z6dWoifQ.Em5B1yYl9AT6jPMlmM1b4w";

const colours = ['#36b9cc', "#B026FF", "#1cc88a"];
var id_colours = {};
var id_coords = {};
var id_names = {};
var routes = [];
var data = {};
var addroutebtn_clicked = false

var dropdown_click = [0,0,0]
var override_dropdown_click = 0

var route_types = {
  "share": [0,0,0],
  "strip":[0,0,0],
  "protect":[0,0,0]
}

var map = null;
var draw = null;
var location_bounds = null;

var location_urls = {
  1: 'mapbox://styles/mariapapadimitriou/ckxrxguwp2ymn14nm3oyyezl9', //Toronto
  2: 'mapbox://styles/mariapapadimitriou/ckysc9fi501lg14p875rio47f' //London
}

function create_map(location_bounds, location_starting_position, location_id){

  map = new mapboxgl.Map({
    container: 'app', // container ID
    style: location_urls[location_id], // style URL
    center: location_starting_position, // starting position [lng, lat]
    zoom: 11, // starting zoom
    maxBounds: location_bounds
  });
  
  draw = new MapboxDraw({
    // Instead of showing all the draw tools, show only the line string and delete tools.
    displayControlsDefault: false,
    controls: {
      trash: false,
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
      },
      {
        'id': 'gl-draw-line-inactive',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'LineString'],
            ['!=', 'mode', 'static']
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#858796',
            'line-dasharray': [0.2, 2],
            'line-width': 2,
            'line-opacity': 0.9
        }
      },
      {
        'id': 'gl-draw-line-active',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'],
            ['==', 'active', 'true']
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': 'black',
            'line-dasharray': [0.2, 2],
            'line-width': 4
        }
      },
      {
        'id': 'gl-draw-point-stroke-active',
        'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'],
            ['==', 'active', 'true'],
            ['!=', 'meta', 'midpoint']
        ],
        'paint': {
            'circle-radius': 7,
            'circle-color': '#fff'
        }
     },
    ]
  });

  map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        bbox: location_bounds
    }),
    "top-right"
  );
  
  map.addControl(draw);
  
  map.on('draw.create', createRoute);
  map.on('draw.update', updateRoute);
  
  map.addControl(new mapboxgl.FullscreenControl());
  map.addControl(new mapboxgl.NavigationControl()); 

}

function setLocationBounds(){

  route_types = {
    "share": [0,0,0],
    "strip":[0,0,0],
    "protect":[0,0,0]
  }
  

  if (draw) {
    for (i = 0; i < draw.getAll().features.length; i++) {
      var id = draw.getAll().features[i].id

      map.removeLayer(id);
      map.removeSource(id);
      
      delete id_colours[id]
      delete id_coords[id]
      delete id_names[id]
      
    }
    draw.deleteAll()

    if (updateLegend) {
      updateLegend()
    }

    if (sharrowsCostSlide1) {
      sharrowsCostSlide1();
      sharrowsCostSlide2();
      
      stripedCostSlide1();
      stripedCostSlide2();
      
      protectedCostSlide1();
      protectedCostSlide2();
    } 
  }
  
  location_id = document.getElementById("locationpicker").value;
  
  var data = {
      "location_id" : location_id
    }
    $.ajax({
      type: "POST",
      url: "/getlocation",
      data: data,
      dataType: 'json',
      success: function(response) {

        location_bounds = response.bounds;
        location_starting_position = response.starting_position
        create_map(location_bounds, location_starting_position, location_id)

        select_names = response.names

        $('#routepicker').empty()

        for (n=0; n < select_names.length; n++) {
          $("#routepicker").append($('<option>'+select_names[n]+'</option>'));
        }
        $('#routepicker').selectpicker('refresh');

      }
    });
}

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

async function getMatch(coordinates, radius, profile, routeid) {

  const radiuses = radius.join(';');
  const query = await fetch(
    `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const response = await query.json();
  if (response.code !== 'Ok') {
    alert(
      `${response.code} - ${response.message}.\n\nPlease input a valid route near a road.`
    );
    draw.delete(routeid)
    delete id_colours[routeid]
    addroutebtn_clicked = true
    changeAddRouteButton()
    updateLegend()
    return;
  }
  const coords = response.matchings[0].geometry;
  // console.log(response.matchings[0].legs[0].steps[0].intersections[0].mapbox_streets_v8.class)


  addRoute(coords, routeid);
}

function addRoute(coords, routeid) {

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
  addroutebtn_clicked = true
  changeAddRouteButton()
}



function removeRoute(btn, id) {

  // select route by id
  draw.changeMode('simple_select', { featureIds: [id] })
  // remove selected route from map
  draw.trash()

  // delete map matching, charts and legend
  if (!map.getSource(id)) return;
  map.removeLayer(id);
  map.removeSource(id);
  
  delete id_colours[id]
  delete id_coords[id]

  if (draw.getAll().features.length == 0) {
    
    document.getElementById('legend').innerHTML = "";
    updateCharts()
  }
  else {

    route_types = {
      "share": [0,0,0],
      "strip":[0,0,0],
      "protect":[0,0,0]
    }

    updateCharts()
  }
  addroutebtn_clicked = true

  dropdown_click = [0,0,0]
  $('#routepicker').selectpicker('val', "");
  updateLegend()
}

function updateLegend() {

  if (addroutebtn_clicked == false) {
    addroutebtn_clicked = true
  }
  else {
    addroutebtn_clicked = false
  }

  const answer = document.getElementById('legend');
  var routes = []

  routes.push("<div class='row'><div class='col'>")

  if (draw.getAll().features.length >= 1) {
    for (let i = 0; i < draw.getAll().features.length; i++) {
      const routeid = draw.getAll().features[i].id

      var dropdown = ["<div class='menu-nav'><div class='menu-item'></div><div class='dropdown-options-container' tabindex='-1'><div class='three-dots'><button class='dropdownbtn' id='dropbtn" +  i + "' onclick='dropdownbtnClick(this.id)'><i class='fas fa-ellipsis-h'></i></div></button><div class='dropdown-options' id='dropdownoptions" + i + "'>"]

      if (routeid in id_names) {
        var routename = id_names[routeid]
        dropdown.push("<a><div><button id='update" + i + "' onclick=\"getUpdateRoutePopup(this.id, \'" + routename + "\'); getCoords("+ i +");\"><span>Save</span><span><i class='fas fa-pen'></i></span></button></div></a>")
        dropdown.push("<a><div><button id='saveas" + i + "' onclick=\"getSaveAsRoutePopup(this.id, \'" + routename + "\'); getCoords("+ i +");\"><span>Save As</span><span><i class='fas fa-save'></i></span></button></div></a>")
        dropdown.push("<a><div><button id='rename" + i + "' onclick=\"getRenameRoutePopup(this.id, \'" + routename + "\'); getCoords("+ i +");\"><span>Rename</span><span><i class='fas fa-font'></i></span></button></div></a>")
        dropdown.push("<a><div><button id='remove" + i + "' onclick=\"removeRoute(this.id, \'" + routeid + "\');\"><span>Remove from Map</span><span><i class='fas fa-times-circle'></i></span></button></div></a>")
        dropdown.push("<a><div><button id='delete" + i + "' onclick=\"getDeleteRoutePopup(this.id, \'" + routename + "\'); getCoords("+ i +");\"><span>Delete Saved</span><span><i class='fas fa-trash'></i></span></button></div></a>")
        dropdown.push("</div></div></div>")

        }
      else {
        var routename = "Route " + (i + 1)
        dropdown.push("<a><div><button id='save" + i + "' onclick=\"getSaveRoutePopup(this.id, \'" + routename + "\'); getCoords("+ i +");\"><span>Save</span><span><i class='fas fa-save'></i></span></button></div></a>")
        dropdown.push("<a><div><button id='remove" + i + "' onclick=\"removeRoute(this.id, \'" + routeid + "\');\"><span>Remove from Map</span><span><i class='fas fa-times-circle'></i></span></button></div></a>")
        dropdown.push("</div></div></div>")
      }

      routes.push("<div style='display: flex; flex-direction: row; justify-content: space-between;'><span style='color:")
      routes.push(id_colours[routeid])
      routes.push(";'><span id='routename_" + i + "'>")
      routes.push("<b>"+ routename)
      routes.push("</b></span><span>&nbsp;&nbsp;&nbsp;" + roundToTwo(turf.length(id_coords[routeid])) + "km</span></span><span>" + dropdown.join("") + "</span></div>")
      routes.push("<div style='height: 10px;'></div>")
      routes.push("<div style='display: flex; justify-content: space-between;'>")

      if (route_types["share"][i] == 1) {
        routes.push("<button class='buttonmode' style='background-color:" + getButtonColour(id_colours[routeid], "share") + "; color: white;' id ='share" + i + "' type='submit' onclick=\"selectOption(this.id,\'"+ id_colours[routeid] + "\'," + route_types["share"][i] +")\"><span>Sharrows</span><span><i class='fas fa-check'></i></span></button>")
      }
      else {
        routes.push("<button class='buttonmode' id ='share" + i + "' type='submit' onclick=\"selectOption(this.id,\'" + id_colours[routeid] + "\'," + route_types["share"][i] +")\"><span>Sharrows</span><span><i class='fa fa-plus-circle'></i></span></button>")
      }

      if (route_types["strip"][i] == 1) {
        routes.push("<button class='buttonmode' style='background-color:" + getButtonColour(id_colours[routeid], "strip") + "; color: white;' type='submit' id ='strip" + i + "' onclick=\"selectOption(this.id,\'"+ id_colours[routeid] + "\'," + route_types["strip"][i] +")\"><span>Striped</span><span><i class='fas fa-check'></i></span></button>")
      }
      else {
        routes.push("<button class='buttonmode' type='submit' id ='strip" + i + "' onclick=\"selectOption(this.id,\'"+ id_colours[routeid] + "\'," + route_types["strip"][i] +")\"><span>Striped</span><span><i class='fa fa-plus-circle'></i></span></button>")
      }

      if (route_types["protect"][i] == 1) {
        routes.push("<button class='buttonmode' style='background-color:" + getButtonColour(id_colours[routeid], "protect") + "; color: white;' type='submit' id ='protect" + i + "' onclick=\"selectOption(this.id,\'"+ id_colours[routeid] + "\'," + route_types["protect"][i] +")\"><span>Protected</span><span><i class='fas fa-check'></i></span></button>")
      }
      else {
        routes.push("<button class='buttonmode' type='submit' id ='protect" + i + "' onclick=\"selectOption(this.id,\'"+ id_colours[routeid] + "\'," + route_types["protect"][i] +")\"><span>Protected</span><span><i class='fa fa-plus-circle'></i></span></button>")
      }
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
    var newdrawline = document.getElementById('addroutebtn');
    newdrawline.disabled = true;
    newdrawline.innerHTML = "Disabled <i class='fas fa-ban'></i>"
    newdrawline.classList.remove("addroutebtn-clicked")
    newdrawline.classList.add('addroutebtn-disabled');
  }
  
  else {
    var newdrawline = document.getElementById('addroutebtn');
    newdrawline.disabled = false;
    newdrawline.classList.remove('addroutebtn-disabled');
    newdrawline.innerHTML = "Draw New Route <i class='fas fa-plus-circle'></i>"
  }

  updateCharts()

  for (let i = 0; i < draw.getAll().features.length; i++) {
    if (document.getElementById("share"+i)) {
      if (arraySum(route_types["share"]) + arraySum(route_types["strip"]) + arraySum(route_types["protect"])<3) {
        route_types["share"][i]=0
        document.getElementById("share"+i).click()
      }
    }
  }
}

function selectOption(btn, clr) {

  if (draw.getMode() != "draw_line_string") {
    var property = document.getElementById(btn);

    const type_full = {"share" : "Sharrows", "strip" : "Striped", "protect" : "Protected"}

    const type = btn.slice(0, -1)
    const routeid = parseInt(btn.charAt(btn.length-1))

    var btn_clr = getButtonColour(clr, type)

    var current_val = route_types[type][routeid]

    const total_clicked = (arraySum(route_types["share"]) + arraySum(route_types["strip"]) + arraySum(route_types["protect"]))
    // if currently clicked, always deselect
    if (current_val == 1) {
      property.style.backgroundColor = "white"
      property.style.color = "black"
      route_types[type][routeid] = 0;        
      property.innerHTML = type_full[type] + "<i class='fa fa-plus-circle'></i>"
    }
    // if not currently clicked, check if 3 combinations already selected
    // if <3 selected, select. if 3 selected, display warning
    else {
      if (total_clicked<3) {
        property.style.backgroundColor = btn_clr
        property.style.color = "white"
        route_types[type][routeid] = 1;
        property.innerHTML = type_full[type] + "<i class='fas fa-check'></i>"
      }
      else {
        document.getElementById("max-combinations-selected").style.display = "block"
        setTimeout(function() {
          document.getElementById("max-combinations-selected").style.display = "none"
        }, 5000);
      }
    }
    updateCharts()
  }
}

function changeAddRouteButton() {

  if (draw.getAll().features.length < 3) {
    if (addroutebtn_clicked == false) {
      draw.changeMode('draw_line_string');
      addroutebtn_clicked = true
      document.getElementById("addroutebtn").classList.add('addroutebtn-clicked');
      document.getElementById("addroutebtn").innerHTML = "Cancel <i class='fas fa-times-circle'></i>"
    }
    else {
      draw.changeMode('simple_select');
      addroutebtn_clicked = false
      document.getElementById("addroutebtn").classList.remove('addroutebtn-clicked');
      document.getElementById("addroutebtn").innerHTML = "Draw New Route <i class='fas fa-plus-circle'></i>"
    }
  }
  else {
    if (draw.getMode() == "draw_line_string") {
      draw.changeMode('simple_select');
      document.getElementById("addroutebtn").classList.remove('addroutebtn-clicked');
      document.getElementById("addroutebtn").innerHTML = "Draw New Route <i class='fas fa-plus-circle'></i>"
      addroutebtn_clicked = false
    }
    else {
      document.getElementById("addroutebtn").innerHTML = "Disabled <i class='fas fa-ban'></i>"
    }
  }
}

document.getElementById('addroutebtn').onclick = function () {
  changeAddRouteButton()
}

function dropdownbtnClick(i) {

  index_num = i[i.length-1]
  var ind = "dropdownoptions" + index_num

  if (dropdown_click[index_num] == 0 & arraySum(dropdown_click) <= 0) {
    dropdown_click[index_num] = 1
    openSettings(ind)
  }
  else {
    dropdown_click[index_num] = 0
    closeSettings(ind)
  }
}

function dropdownbtnOverrideClick() {

  if (override_dropdown_click == 0 ) {
    override_dropdown_click = 1
    openSettings('override-dropdown-options')
  }
  else {
    override_dropdown_click = 0
    closeSettings('override-dropdown-options')
  }
}

function openSettings(ind) {
  document.getElementById(ind).style.opacity = 1
  document.getElementById(ind).style.zIndex = 999
  document.getElementById(ind).style.backgroundColor = "white"
  document.getElementById(ind).style.display = "block"
  document.getElementById(ind).style.maxHeight = "100vh"
  document.getElementById(ind).style.transition = "transition: opacity 0.2s, z-index 0.2s, max-height 0.2s;"
  document.getElementById(ind).style.right = "15px";
  document.getElementById(ind).style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px;"
}

function closeSettings(ind) {
  document.getElementById(ind).style.opacity = 0
  document.getElementById(ind).style.zIndex = -1
  document.getElementById(ind).style.backgroundColor = "white"
  document.getElementById(ind).style.display = "none"
  document.getElementById(ind).style.maxHeight = "0"
  document.getElementById(ind).style.transition = "transition: opacity 0.2s, z-index 0.2s, max-height 0.2s;"
}

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
    "routetypes": {'sharrows': route_types["share"], "striped": route_types["strip"], "protected": route_types["protect"]},
    "colours": c,
    "coordinates": coords,
    "length": arr_length,
    "overrides": {
      "cost_sharrows": [sharrows_cost_slider_1.value, sharrows_cost_slider_2.value], 
      "riders": [bike_commuters_slider_1.value, bike_commuters_slider_2.value],
      "modal_shift": [modal_shift_slider_1.value, modal_shift_slider_2.value],
      "cost_protected": [protected_cost_slider_1.value, protected_cost_slider_2.value],
      "cost_striped": [striped_cost_slider_1.value, striped_cost_slider_2.value],
      "emissions": [emissions_slider_1.value, emissions_slider_2.value]
    }
  }
  var new_colours = []
  
  $.ajax({
    type: "POST",
    url: "/plotcharts",
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

      for (let i = 0; i < labels_plot.length; i++) {
        var routetype = labels_plot[i].split(" ")[2]

        if (routetype=="Sharrows") {
          new_colours.push(plot_colours[i])
        }
        else if (routetype=="Striped") {
          new_colours.push(pSBC(-0.5, plot_colours[i]))
        }
        else {
          new_colours.push(pSBC(-0.8, plot_colours[i]))
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

setLocationBounds()
create_map(location_bounds)