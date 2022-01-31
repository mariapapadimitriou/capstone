save_routes = []
save_id = []

function getUpdateRoutePopup(btn, route_name) {
  
  document.getElementById('update-header').innerHTML = "Save New Route Coordinates"
  document.getElementById('update-route-name').innerHTML = route_name

  document.getElementById('update-popup').style.display = "block";
  toggle(btn[btn.length-1], dropdown_click)
  closeSettings("dropdownoptions" + btn[btn.length-1])
}

document.getElementById('update-submit').onclick = function(e){

  e.preventDefault();

  if (document.getElementById('update-header').innerHTML == "Save New Route Coordinates") { 

    var data = {
      "route_name" : document.getElementById("update-route-name").innerHTML,
      "start_coordinates" : save_routes[0][0],
      "end_coordinates" : save_routes[0][1]
    }
    $.ajax({
      type: "POST",
      url: "/updateroute",
      data: data,
      dataType: 'json',
      success: function(response) {

        document.getElementById('update-popup').style.display = "none";
        
        document.getElementById('status-message').innerHTML = response.message

        document.getElementById('status-popup').style.display = "block";
          
      }
    });
  }
  else {
      alert('revisit for updating overrides. if this comes up now something went wrong :)')
  //   var data = {
  //     "override_name" : document.getElementById("save-name").value.trim(),
  //     "sharrows_cost_min" : document.getElementById("sharrows_cost_slider_1").value,
  //     "sharrows_cost_max" : document.getElementById("sharrows_cost_slider_2").value,
  //     "striped_cost_min" : document.getElementById("striped_cost_slider_1").value,
  //     "striped_cost_max" : document.getElementById("striped_cost_slider_2").value,
  //     "protected_cost_min" : document.getElementById("protected_cost_slider_1").value,
  //     "protected_cost_max" : document.getElementById("protected_cost_slider_2").value,
  //     "bicycle_commuters_min" : document.getElementById("bike_commuters_slider_1").value,
  //     "bicycle_commuters_max" : document.getElementById("bike_commuters_slider_2").value,
  //     "new_riders_min" : document.getElementById("modal_shift_slider_1").value,
  //     "new_riders_max" : document.getElementById("modal_shift_slider_2").value,
  //     "emissions_per_km_min" : document.getElementById("emissions_slider_1").value,
  //     "emissions_per_km_max" : document.getElementById("emissions_slider_2").value,
  //   }

  //   $.ajax({
  //     type: "POST",
  //     url: "/saveoverrides",
  //     data: data,
  //     dataType: 'json',
  //     success: function(response) {
  //       var status = response.status
  //       if (status == 0){
  //         document.getElementById('save-popup').style.display = "none";

  //         document.getElementById("valid-chars").innerHTML = ""
  //         document.getElementById('status-message').innerHTML = response.message

  //         document.getElementById('status-popup').style.display = "block";

  //         $("#overridepicker").append($('<option>'+data["override_name"]+'</option>'));
  //         $('#overridepicker').selectpicker('refresh');
  //       }
  //       else {
  //         document.getElementById("valid-name").innerHTML = response.message
  //       }
  //     }
  //   }); 
  }
}

document.getElementById('update-cancel').onclick =  function(e){
  e.preventDefault();
  document.getElementById('update-popup').style.display = "none";
}