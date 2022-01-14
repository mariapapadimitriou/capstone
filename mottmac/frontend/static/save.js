
function saveRoute(btn) {

    document.getElementById('modalOne').style.display = "block";
    let routenum = parseInt(btn.charAt(btn.length-1)) + 1
    document.getElementById('savetype').innerHTML = "Save Route"
    document.getElementById('routename').innerHTML = "Route " + (routenum)
  
  }
  
  function saveOverrides() {
    document.getElementById('modalOne').style.display = "block";
    document.getElementById('savetype').innerHTML = "Save Overrides"
  }
  
  var save_routes = []
  function getCoords(i){
      save_routes = []
      var routeid = draw.getAll().features[i].id
      var coords = id_coords[routeid].coordinates
      save_routes.push([coords[0], coords[coords.length-1]])
      console.log(save_routes)
  }
  
  
  window.onclick = function(event) {
    if(event.target.className === "modal") {
      event.target.style.display = "none";
    }
  }
  
  const form = document.querySelector('form');
  
  form.addEventListener('submit', function(e) {
      e.preventDefault();
  
      if (document.getElementById('savetype').innerHTML == "Save Route") {
  
        var data = {
          "route_name" : document.getElementById("route_name").value,
          "start_coordinates" : save_routes[0][0],
          "end_coordinates" : save_routes[0][1]
        }
      
        $.ajax({
          type: "POST",
          url: "/saveroute",
          data: data,
          dataType: 'json',
        });
  
      }
      else {
        var data = {
          "override_set_name" : document.getElementById("route_name").value,
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
        });
      }
      document.getElementById("route_name").value = ""
  });
  
  form.addEventListener('cancel', function(e) {
    e.preventDefault();
  });
  
  document.getElementById('formsubmit').onclick =  function(){
    document.getElementById('modalOne').style.display = "none";
  }
  
  document.getElementById('formcancel').onclick =  function(){
    document.getElementById('modalOne').style.display = "none";
  }
  