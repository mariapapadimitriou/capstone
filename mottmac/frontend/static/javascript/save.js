var save_routes = []
var save_id = []

function getSaveRoutePopup(btn, route_id) {
  document.getElementById("save-name").value = ""
  document.getElementById("valid-chars").innerHTML = "";
  document.getElementById('save-status-message').innerHTML = "";
  
  document.getElementById('save-header').innerHTML = "Save Route"
  document.getElementById('save-route-num').innerHTML = route_id

  document.getElementById('save-popup').style.display = "block";
}

function getSaveAsRoutePopup(btn, route_id) {
  document.getElementById("save-name").value = ""
  document.getElementById("valid-chars").innerHTML = "";
  document.getElementById('save-status-message').innerHTML = "";
  
  document.getElementById('save-header').innerHTML = "Save As New Route"
  document.getElementById('save-route-num').innerHTML = route_id

  document.getElementById('save-popup').style.display = "block";
}

function getUpdateRoutePopup(btn, route_id) {
  document.getElementById("save-name").value = ""
  document.getElementById("valid-chars").innerHTML = "";
  document.getElementById('save-status-message').innerHTML = "";
  document.getElementById('save-popup').style.display = "block";
  let routenum = parseInt(btn.charAt(btn.length-1)) + 1
  document.getElementById('save-header').innerHTML = "Save Route"
  document.getElementById('save-route-num').innerHTML = "Route " + (routenum)
}
  
function getSaveOverridesPopup() {
  document.getElementById("save-name").value = ""
  document.getElementById("valid-chars").innerHTML = "";
  document.getElementById('save-status-message').innerHTML = "";
  document.getElementById('save-popup').style.display = "block";
  document.getElementById('save-header').innerHTML = "Save Overrides"
  document.getElementById('save-route-num').innerHTML = null
}
  
function getCoords(i){
    save_routes = []
    save_id = []
    var routeid = draw.getAll().features[i].id
    var coords = id_coords[routeid].coordinates
    save_id.push(routeid)
    save_routes.push([coords[0], coords[coords.length-1]])
}
  
window.onclick = function(event) {
  if(event.target.className == "modal") {
    event.target.style.display = "none";
  }
}
 
document.getElementById('save-submit').onclick = function(e){

  e.preventDefault();

  if (document.getElementById('save-header').innerHTML == "Save Route") {

    var data = {
      "route_name" : document.getElementById("save-name").value.trim(),
      "route_id" : save_id[0],
      "start_coordinates" : save_routes[0][0],
      "end_coordinates" : save_routes[0][1]
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

          document.getElementById("valid-chars").innerHTML = ""
          document.getElementById('save-status-message').innerHTML = response.message

          document.getElementById('save-status-popup').style.display = "block";

          $("#routepicker").append($('<option>'+data["route_name"]+'</option>'));
          $('#routepicker').selectpicker('refresh');
          $('#routepicker').selectpicker('val', data["route_name"]);

          id_names[data["route_id"]] = data["route_name"]
          updateLegend()
        }
        else {
          document.getElementById("valid-name").innerHTML = response.message
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

          document.getElementById("valid-chars").innerHTML = ""
          document.getElementById('save-status-message').innerHTML = response.message

          document.getElementById('save-status-popup').style.display = "block";

          $("#overridepicker").append($('<option>'+data["override_name"]+'</option>'));
          $('#overridepicker').selectpicker('refresh');
        }
        else {
          document.getElementById("valid-name").innerHTML = response.message
        }
      }
    }); 
  }
}

document.getElementById('save-cancel').onclick =  function(e){
  e.preventDefault();
  document.getElementById("valid-chars").innerHTML = ""
  document.getElementById("valid-name").innerHTML = ""
  document.getElementById('save-popup').style.display = "none";
}