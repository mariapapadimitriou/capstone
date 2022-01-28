function getSaveRoutePopup(btn, route_name) {
  document.getElementById("save-name").value = ""
  document.getElementById("save-name-valid-chars").innerHTML = "";
  document.getElementById('status-message').innerHTML = "";
  
  document.getElementById('save-header').innerHTML = "Save Route"
  document.getElementById('save-route-num').innerHTML = route_name

  document.getElementById('save-popup').style.display = "block";
  
  toggle(btn[btn.length-1], dropdown_click)
  closeSettings("dropdownoptions" + btn[btn.length-1])
}

function getSaveAsRoutePopup(btn, route_name) {
  document.getElementById("save-name").value = ""
  document.getElementById("save-name-valid-chars").innerHTML = "";
  document.getElementById('status-message').innerHTML = "";
  
  document.getElementById('save-header').innerHTML = "Save As New Route"
  document.getElementById('save-route-num').innerHTML = route_name

  document.getElementById('save-popup').style.display = "block";
  
  toggle(btn[btn.length-1], dropdown_click)
  closeSettings("dropdownoptions" + btn[btn.length-1])
}

function getSaveOverridesPopup() {
  document.getElementById("save-name").value = ""
  document.getElementById("save-name-valid-chars").innerHTML = "";
  document.getElementById('status-message').innerHTML = "";
  document.getElementById('save-popup').style.display = "block";
  document.getElementById('save-header').innerHTML = "Save Overrides"
  document.getElementById('save-route-num').innerHTML = null
}
 
document.getElementById('save-submit').onclick = function(e){

  e.preventDefault();

  if (["Save Route", "Save As New Route"].includes(document.getElementById('save-header').innerHTML)) {

    if (document.getElementById('save-header').innerHTML == "Save Route") {
      var data = {
        "route_name" : document.getElementById("save-name").value.trim(),
        "route_id" : save_id[0],
        "start_coordinates" : save_routes[0][0],
        "end_coordinates" : save_routes[0][1],
        "location_id": document.getElementById("locationpicker").value
      }
    }
    else {

      draw.delete(save_id[0])
      delete id_names[save_id[0]]
      delete id_colours[save_id[0]]
      delete id_coords[save_id[0]]
      map.removeLayer(save_id[0])
      map.removeSource(save_id[0])

      var feature = {
        type: 'Feature',
        properties: {},
        geometry: {type: 'LineString', coordinates: [save_routes[0][0], save_routes[0][1]]}
      }

      var featureid = draw.add(feature);

      var data = {
        "route_name" : document.getElementById("save-name").value.trim(),
        "route_id" : featureid[0],
        "start_coordinates" : feature.geometry.coordinates[0],
        "end_coordinates" : feature.geometry.coordinates[feature.geometry.coordinates.length - 1],
        "location_id": document.getElementById("locationpicker").value
      }

      id_names[featureid[0]] = data["route_name"]
      id_coords[featureid[0]] = feature.geometry
      createRoute()
    }

    $.ajax({
      type: "POST",
      url: "/saveroute",
      data: data,
      dataType: 'json',
      success: function(response) {
        var status = response.status
        if (status == 0){
          document.getElementById('save-popup').style.display = "none";

          document.getElementById("save-name-valid-chars").innerHTML = ""
          document.getElementById('status-message').innerHTML = response.message

          document.getElementById('status-popup').style.display = "block";

          $("#routepicker").append($('<option>'+data["route_name"]+'</option>'));
          $('#routepicker').selectpicker('refresh');
          $('#routepicker').selectpicker('val', data["route_name"]);

          id_names[data["route_id"]] = data["route_name"]
          updateLegend()
        }
        else {
          document.getElementById("valid-save-name").innerHTML = response.message
        }       
        route_types = {
          "share": [0,0,0],
          "strip":[0,0,0],
          "protect":[0,0,0]
        }     
      }
    });
  }
  else {
    var data = {
      "override_name" : document.getElementById("save-name").value.trim(),
      "sharrows_cost_min" : document.getElementById("sharrows_cost_slider_1").value,
      "sharrows_cost_max" : document.getElementById("sharrows_cost_slider_2").value,
      "striped_cost_min" : document.getElementById("striped_cost_slider_1").value,
      "striped_cost_max" : document.getElementById("striped_cost_slider_2").value,
      "protected_cost_min" : document.getElementById("protected_cost_slider_1").value,
      "protected_cost_max" : document.getElementById("protected_cost_slider_2").value,
      "bicycle_commuters_min" : document.getElementById("bike_commuters_slider_1").value,
      "bicycle_commuters_max" : document.getElementById("bike_commuters_slider_2").value,
      "new_riders_min" : document.getElementById("modal_shift_slider_1").value,
      "new_riders_max" : document.getElementById("modal_shift_slider_2").value,
      "emissions_per_km_min" : document.getElementById("emissions_slider_1").value,
      "emissions_per_km_max" : document.getElementById("emissions_slider_2").value,
    }

    $.ajax({
      type: "POST",
      url: "/saveoverrides",
      data: data,
      dataType: 'json',
      success: function(response) {
        var status = response.status
        if (status == 0){
          document.getElementById('save-popup').style.display = "none";

          document.getElementById("save-name-valid-chars").innerHTML = ""
          document.getElementById('status-message').innerHTML = response.message

          document.getElementById('status-popup').style.display = "block";

          $("#overridepicker").append($('<option>'+data["override_name"]+'</option>'));
          $('#overridepicker').selectpicker('refresh');
        }
        else {
          document.getElementById("valid-save-name").innerHTML = response.message
        }
      }
    }); 
  }
}

document.getElementById('save-cancel').onclick =  function(e){
  e.preventDefault();
  document.getElementById("save-name-valid-chars").innerHTML = ""
  document.getElementById("valid-save-name").innerHTML = ""
  document.getElementById('save-popup').style.display = "none";
}

