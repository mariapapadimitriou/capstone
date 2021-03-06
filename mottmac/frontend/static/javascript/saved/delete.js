
function getDeleteRoutePopup(btn, route_name) {
  document.getElementById('delete-header').innerHTML = "Delete Route"
  document.getElementById('delete-route-name').innerHTML = route_name
  document.getElementById('delete-popup').style.display = "block";
  toggle(btn[btn.length-1], dropdown_click)
  closeSettings("dropdownoptions" + btn[btn.length-1])
}

document.getElementById('delete-submit').onclick = function(e){

  e.preventDefault();

  if (document.getElementById('delete-header').innerHTML == "Delete Route") { 

    var data = {
      "route_name" : document.getElementById("delete-route-name").innerHTML
    }

    var route_id = getKeyByValue(id_names, data["route_name"])
    draw.delete(route_id)
    delete id_names[route_id]
    delete id_colours[route_id]
    delete id_coords[route_id]
    map.removeLayer(route_id)
    map.removeSource(route_id)
    updateLegend()

    $.ajax({
      type: "POST",
      url: "/deleteroute",
      data: data,
      dataType: 'json',
      success: function(response) {

        document.getElementById('delete-popup').style.display = "none";
        
        document.getElementById('status-message').innerHTML = response.message

        document.getElementById('status-popup').style.display = "block";

        $('#routepicker').selectpicker('val', data["route_name"]);
        $('#routepicker option:selected').remove(); 
        $('#routepicker').selectpicker('refresh');
          
      }
    });
  }
  else {
      alert('revisit for deleting overrides. if this comes up now something went wrong :)')
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

document.getElementById('delete-cancel').onclick =  function(e){
    e.preventDefault();
    document.getElementById('delete-popup').style.display = "none";
  }