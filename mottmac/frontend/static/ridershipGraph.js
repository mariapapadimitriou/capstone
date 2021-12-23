var data = [
    {
        type: 'box',
        marker: {
            color: "#4e73df"
        },
        name: "Route 1",
        y: [0.2, 0.4],
        x: ["Cost", "Cost"],
        showlegend: false,
    },
    {
        type: 'box',
        marker: {
            color: "#36b9cc"
        },
        name: "Route 2",
        y: [0.3, 0.5],
        x: ["Cost", "Cost"],
        showlegend: false,
    },
    {
        type: 'box',
        marker: {
            color: "#1cc88a"
        },
        name: "Route 3",
        y: [0.2, 0.5],
        x: ["Cost", "Cost"],
        showlegend: false,
    }
]
                                      
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