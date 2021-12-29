function getRidershipPlot(plot_colours, plot_labels, plot_data) {

    var data = []

    for (let i = 0; i < plot_colours.length; i++) {

        point = {
            type: 'box',
            marker: {
                color: plot_colours[i]
            },
            name: plot_labels[i],
            y: plot_data[i],
            x: ["Ridership", "Ridership"],
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
                                      
Plotly.newPlot('ridership', data, layout, {displayModeBar: false});

}