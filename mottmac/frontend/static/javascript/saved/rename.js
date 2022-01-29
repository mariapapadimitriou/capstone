function getRenameRoutePopup(btn, route_name) {
    document.getElementById("rename-name").value = ""
    document.getElementById("rename-name-valid-chars").innerHTML = "";
    document.getElementById('status-message').innerHTML = "";
    
    document.getElementById('rename-header').innerHTML = "Rename Route"
    document.getElementById('rename-current-name').innerHTML = route_name
  
    document.getElementById('rename-popup').style.display = "block";
    toggle(btn[btn.length-1], dropdown_click)
    closeSettings("dropdownoptions" + btn[btn.length-1])
  }
  
   
  document.getElementById('rename-submit').onclick = function(e){
  
    e.preventDefault();
  
    if (document.getElementById('rename-header').innerHTML == "Rename Route") {
  
      var data = {
        "old_route_name" : document.getElementById("rename-current-name").innerHTML,
        "new_route_name": document.getElementById("rename-name").value.trim(),
        "route_id" : save_id[0],
      }
  
      $.ajax({
        type: "POST",
        url: "/renameroute",
        data: data,
        dataType: 'json',
        success: function(response) {
          var status = response.status
          if (status == 0){
            document.getElementById('rename-popup').style.display = "none";
  
            document.getElementById("rename-name-valid-chars").innerHTML = ""
            document.getElementById('status-message').innerHTML = response.message
  
            document.getElementById('status-popup').style.display = "block";

            $('#routepicker').selectpicker('val', data["old_route_name"]);
            $('#routepicker option:selected').remove(); 
            
            $("#routepicker").append($('<option>'+data["new_route_name"]+'</option>'));
            $('#routepicker').selectpicker('refresh');

            $('#routepicker').selectpicker('val', data["new_route_name"]);

            id_names[data["route_id"]] = data["new_route_name"]
            updateLegend()
          }
          else {
            document.getElementById("valid-rename-name").innerHTML = response.message
          }            
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
  
    //         document.getElementById("rename-name-valid-chars").innerHTML = ""
    //         document.getElementById('status-message').innerHTML = response.message
  
    //         document.getElementById('status-popup').style.display = "block";
  
    //         $("#overridepicker").append($('<option>'+data["override_name"]+'</option>'));
    //         $('#overridepicker').selectpicker('refresh');
    //       }
    //       else {
    //         document.getElementById("valid-rename-name").innerHTML = response.message
    //       }
    //     }
    //   }); 
    }
  }
  
  document.getElementById('rename-cancel').onclick =  function(e){
    e.preventDefault();
    document.getElementById("rename-name-valid-chars").innerHTML = ""
    document.getElementById("valid-rename-name").innerHTML = ""
    document.getElementById('rename-popup').style.display = "none";
  }
