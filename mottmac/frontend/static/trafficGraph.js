function getTrafficPlot(plot_colours, plot_labels, plot_data) {

    var return_string = "<div style='display: flex; justify-content: space-evenly;'>"

    for (let i = 0; i < plot_colours.length; i++) {

        return_string += "<span style='color:" + plot_colours[i] + ";'>"

        if (plot_data[i] == 1) {
            return_string += "<b>" + plot_labels[i] + "</b> &nbsp;&nbsp;&nbsp;<span style='color: #ff1818;'><i class='fas fa-minus-circle'></i></span>"
        }
        else {
            return_string += "<b>" + plot_labels[i] + "</b> &nbsp;&nbsp;&nbsp;<span style='color: #1cc88a;'><i class='fas fa-check-circle'></i></span>"
        }

        return_string += "</span>"

    }

    console.log(return_string)
    document.getElementById("traffic").innerHTML = return_string + "</div>"

}
