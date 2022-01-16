
function saveRoute(btn) {

    document.getElementById("save_name").value = ""
    document.getElementById('submitPopup').style.display = "block";
    let routenum = parseInt(btn.charAt(btn.length-1)) + 1
    document.getElementById('savetype').innerHTML = "Save Route"
    document.getElementById('routename').innerHTML = "Route " + (routenum)
  
}
  
function saveOverrides() {
    document.getElementById("save_name").value = ""
    document.getElementById('submitPopup').style.display = "block";
    document.getElementById('savetype').innerHTML = "Save Overrides"
    document.getElementById('routename').innerHTML = null
}
  
var save_routes = []
function getCoords(i){
    save_routes = []
    var routeid = draw.getAll().features[i].id
    var coords = id_coords[routeid].coordinates
    save_routes.push([coords[0], coords[coords.length-1]])
}
  
  
window.onclick = function(event) {
  if(event.target.className === "modal") {
    event.target.style.display = "none";
  }
}
  
document.getElementById('formsubmit').onclick =  function(e){
    e.preventDefault();

    document.getElementById('submitPopup').style.display = "none";

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
              document.getElementById('statusheader').innerHTML = "Success"
              document.getElementById('statusheader').style.color = "green"
            }
            else {
              document.getElementById('statusheader').innerHTML = "Failure"
              document.getElementById('statusheader').style.color = "red"
            }
            document.getElementById('statusmessage').innerHTML = response.message
          }
        });
  
      }
      else {
        var data = {
          "override_name" : document.getElementById("save_name").value.trim(),
          "sharrows_cost_min" : document.getElementById("slider1").value,
          "sharrows_cost_max" : document.getElementById("slider2").value,
          "striped_cost_min" : document.getElementById("slider1-striped").value,
          "striped_cost_max" : document.getElementById("slider2-striped").value,
          "protected_cost_min" : document.getElementById("slider1-protect").value,
          "protected_cost_max" : document.getElementById("slider2-protect").value,
          "bicycle_commuters_min" : document.getElementById("sliderRide1").value,
          "bicycle_commuters_max" : document.getElementById("sliderRide2").value,
          "new_riders_min" : document.getElementById("sliderModal1").value,
          "new_riders_max" : document.getElementById("sliderModal2").value,
          "emissions_per_km_min" : document.getElementById("sliderEm1").value,
          "emissions_per_km_max" : document.getElementById("sliderEm2").value,
        }
  
            $.ajax({
                type: "POST",
                url: "/saveoverrides",
                data: data,
                dataType: 'json',
                success: function(response) {
                  var status = response.status
                  if (status == 0){
                    document.getElementById('statusheader').innerHTML = "Success"
                    document.getElementById('statusheader').style.color = "green"
                  }
                  else {
                    document.getElementById('statusheader').innerHTML = "Failure"
                    document.getElementById('statusheader').style.color = "red"
                  }
                  document.getElementById('statusmessage').innerHTML = response.message
                }
              });
            
      }
    document.getElementById("validchars").innerHTML = ""
    document.getElementById('submitStatusPopup').style.display = "block";
  
}

document.getElementById('formcancel').onclick =  function(e){
    e.preventDefault();
    document.getElementById("validchars").innerHTML = ""
    document.getElementById('submitPopup').style.display = "none";
}

function validate(e) {
    if (!/^[a-zA-Z0-9 ]+$/.test(e.value) & document.getElementById("save_name").value.length > 0) {
        document.getElementById("save_name").value = document.getElementById("save_name").value.slice(0, document.getElementById("save_name").value.length-1)
        document.getElementById("validchars").innerHTML = "Input must contain only letters or numbers."
        document.getElementById("validchars").style.color = "red"
    }

}