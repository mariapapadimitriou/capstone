function getTrafficPlot(plot_colours, plot_labels, plot_data) {

    var return_string = "<div style='display: flex; justify-content: space-around;'>"
    
    for (let i = 0; i < plot_colours.length; i++) {

        if (plot_data[i] == 1) {
            return_string += "<span style='color: #ff1818; font-size: 50px;'><i class='fas fa-minus-circle'></i></span>"
        }
        else {
            return_string += "<span style='color: #1cc88a; font-size: 50px;'><i class='fas fa-check-circle'></i></span>"
        }

        return_string += "</span>"

    }
    
    document.getElementById("traffic").innerHTML = return_string + "</div>"

}
