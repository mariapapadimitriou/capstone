function getOverrides() {

    var o_name = document.getElementById("overridepicker").value

    $.ajax({
        type: "POST",
        url: "/getoverrides",
        data: {"name" : o_name},
        dataType: 'json',
        success: function(data) {

            document.getElementById("save_name").value = data["override_name"]

            document.getElementById("slider1").value = data["sharrows_cost_min"]
            document.getElementById("slider2").value = data["sharrows_cost_max"]
            
            document.getElementById("slider1-striped").value = data["striped_cost_min"]
            document.getElementById("slider2-striped").value = data["striped_cost_max"]
            
            document.getElementById("sliderRide1").value = data["bicycle_commuters_min"]
            document.getElementById("sliderRide2").value = data["bicycle_commuters_max"]
            
            document.getElementById("slider1-protect").value = data["protected_cost_min"]
            document.getElementById("slider2-protect").value = data["protected_cost_max"]
            
            document.getElementById("sliderModal1").value = data["new_riders_min"]
            document.getElementById("sliderModal2").value = data["new_riders_max"]
            
            document.getElementById("sliderEm1").value = data["emissions_per_km_min"]
            document.getElementById("sliderEm2").value = data["emissions_per_km_max"]

            slideOne();
            slideTwo();
    
            slideOneRide();
            slideTwoRide();
    
            slideOneModal();
            slideTwoModal();
    
            slideOneStriped();
            slideTwoStriped();
    
            slideOneProtect();
            slideTwoProtect();
    
            slideOneEm();
            slideTwoEm();

            updateCharts();
          }
    });
}

function getRoutes() {
    var r_name = document.getElementById("routepicker").value

    data = {
        "name" : r_name
    }

    $.ajax({
        type: "POST",
        url: "/getroutes",
        data: data,
        dataType: 'json',
        success: function(data) {
            if (draw.getAll().features.length <= 2) {
                var feature = { type: 'LineString', coordinates: [data["start_coordinates"],data["end_coordinates"]] };
                draw.add(feature);
                createRoute()
            }
          }
    });
}