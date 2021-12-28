function getCostPlot(cost_plot_colours, cost_plot_labels, cost_plot_data) {

    var data = []

    for (let i = 0; i < cost_plot_colours.length; i++) {

        point = {
            type: 'box',
            marker: {
                color: cost_plot_colours[i]
            },
            name: cost_plot_labels[i],
            y: cost_plot_data[i],
            x: ["Cost", "Cost"],
            showlegend: false
        }
        data.push(point)
    }
                                          
    var layout = {
        font: {
            family: 'Nunito',
            size: 12,
            color: '#7f7f7f'
            },
        boxmode: 'group',
        showlegend: false,
        margin: {
            autoexpand: true,
            b: 0,
            t: 0,
            l: 20,
            r: 0
        },
        hovermode:'closest',
        hoverlabel: {
            bordercolor: "white",
            font: {
                family: 'Nunito',
            }
        },
        xaxis:{
            zeroline:false, 
            hoverformat: '.2f',
        },
        yaxis:{
            zeroline:false, 
            hoverformat: '.2r', 
        },
    };

    return Plotly.newPlot('cost', data, layout);
}