var save_routes = []

function saveRoute(btn) {
  document.getElementById("save_name").value = ""
  document.getElementById("validchars").innerHTML = "";
  document.getElementById('statusmessage').innerHTML = "";
  document.getElementById('submitPopup').style.display = "block";
  let routenum = parseInt(btn.charAt(btn.length-1)) + 1
  document.getElementById('savetype').innerHTML = "Save Route"
  document.getElementById('routename').innerHTML = "Route " + (routenum)
}
  
function saveOverrides() {
  document.getElementById("save_name").value = ""
  document.getElementById("validchars").innerHTML = "";
  document.getElementById('statusmessage').innerHTML = "";
  document.getElementById('submitPopup').style.display = "block";
  document.getElementById('savetype').innerHTML = "Save Overrides"
  document.getElementById('routename').innerHTML = null
}
  
function getCoords(i){
    save_routes = []
    var routeid = draw.getAll().features[i].id
    var coords = id_coords[routeid].coordinates
    save_routes.push([coords[0], coords[coords.length-1]])
}
  
window.onclick = function(event) {
  if(event.target.className == "modal") {
    event.target.style.display = "none";
  }
}
 
document.getElementById('formsubmit').onclick = function(e){
  
  e.preventDefault();

  if (document.getElementById('savetype').innerHTML == "Save Route") {

    var data = {
      "route_name" : document.getElementById("save_name").value.trim(),
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
          document.getElementById('submitPopup').style.display = "none";

          document.getElementById("validchars").innerHTML = ""
          document.getElementById('statusmessage').innerHTML = response.message

          document.getElementById('submitStatusPopup').style.display = "block";

          $("#routepicker").append($('<option>'+data["route_name"]+'</option>'));
          $('#routepicker').selectpicker('refresh');
        }
        else {
          document.getElementById("validname").innerHTML = response.message
        }            
      }
    });
  }
  else {
    var data = {
      "override_name" : document.getElementById("save_name").value.trim(),
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
          document.getElementById('submitPopup').style.display = "none";

          document.getElementById("validchars").innerHTML = ""
          document.getElementById('statusmessage').innerHTML = response.message

          document.getElementById('submitStatusPopup').style.display = "block";

          $("#overridepicker").append($('<option>'+data["override_name"]+'</option>'));
          $('#overridepicker').selectpicker('refresh');
        }
        else {
          document.getElementById("validname").innerHTML = response.message
        }
      }
    }); 
  }
}

document.getElementById('formcancel').onclick =  function(e){
  e.preventDefault();
  document.getElementById("validchars").innerHTML = ""
  document.getElementById("validname").innerHTML = ""
  document.getElementById('submitPopup').style.display = "none";
}