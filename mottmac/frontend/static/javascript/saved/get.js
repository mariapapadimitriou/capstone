function setOverrides() {

    var o_name = document.getElementById("overridepicker").value

    $.ajax({
        type: "POST",
        url: "/getoverrides",
        data: {"name" : o_name},
        dataType: 'json',
        success: function(data) {

            document.getElementById("save-name").value = data["override_name"]

            document.getElementById("sharrows_cost_slider_1").value = data["sharrows_cost_min"]
            document.getElementById("sharrows_cost_slider_2").value = data["sharrows_cost_max"]
            
            document.getElementById("striped_cost_slider_1").value = data["striped_cost_min"]
            document.getElementById("striped_cost_slider_2").value = data["striped_cost_max"]
            
            document.getElementById("bike_commuters_slider_1").value = data["bicycle_commuters_min"]
            document.getElementById("bike_commuters_slider_2").value = data["bicycle_commuters_max"]
            
            document.getElementById("protected_cost_slider_1").value = data["protected_cost_min"]
            document.getElementById("protected_cost_slider_2").value = data["protected_cost_max"]
            
            document.getElementById("modal_shift_slider_1").value = data["new_riders_min"]
            document.getElementById("modal_shift_slider_2").value = data["new_riders_max"]
            
            document.getElementById("emissions_slider_1").value = data["emissions_per_km_min"]
            document.getElementById("emissions_slider_2").value = data["emissions_per_km_max"]

            sharrowsCostSlide1();
            sharrowsCostSlide2();
            
            stripedCostSlide1();
            stripedCostSlide2();
            
            protectedCostSlide1();
            protectedCostSlide2();
            
            bikeCommutersSlide1();
            bikeCommutersSlide2();
            
            modalShiftSlide1();
            modalShiftSlide2();
            
            emissionsSlide1();
            emissionsSlide2();
            
            updateCharts();
          }
    });
}

function plotSavedRoute() {
    
    if (draw.getMode() != "draw_line_string") {
        var r_name = document.getElementById("routepicker").value

        if (r_name != "") {
            data = {
                "name" : r_name
            }
        
            $.ajax({
                type: "POST",
                url: "/getroute",
                data: data,
                dataType: 'json',
                success: function(data) {

                    const plotted_features = []

                    for (i=0; i<draw.getAll().features.length; i++) {
                        plotted_features.push(draw.getAll().features[i].id)
                    }

                    if (!plotted_features.includes(data["route_id"])) {
                        
                        var r = data["route_name"]
                        var route_id = data["route_id"]
                        id_names = data["route_ids"]
            
                        if (draw.getAll().features.length <= 2) {
        
                            var feature = {
                                id: route_id,
                                type: 'Feature',
                                properties: {},
                                geometry: {type: 'LineString', coordinates: [data["start_coordinates"],data["end_coordinates"]] }
                            }
        
                            var featureid = draw.add(feature);
                            
                            id_names[featureid] = r
        
                            createRoute()

                        }
                    }
                }
            });
        }
    }
    $('#routepicker').selectpicker('val', "");
    $('#routepicker').selectpicker('refresh');

}