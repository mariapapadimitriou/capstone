function getCostPlot(plot_colours, plot_labels, plot_data) {

    var data = [];

    let nunSerie = 0;
    
    let thresholdsHover = {
        type: 'bar',
        x: [],
        y: [],
        text: [],
        hovertemplate:
        "%{text}" +
        "<extra></extra>",
        marker: {
            color: "black",
        },
        hoverFormat: '.2f',
        hoverinfo: 'text', // show only hovertext in tooltip
        showlegend: false, // hide legend
        opacity: 0, // hide bars
        width: .5, // align tooltips (have same width for boxplot and bars to)
    };

    for (const serie of plot_labels) {
        
        var index_of = plot_labels.indexOf(serie)
        const threshold_max = Math.round(plot_data[index_of].max())
        const threshold_min = Math.round(plot_data[index_of].min())
    
        // boxplot https://plotly.com/javascript/reference/#box-text
        data.push({

            type: 'box',
            y: plot_data[index_of],
            name: serie,
            marker: {
                color: plot_colours[index_of]
            },
            hoverinfo: "skip", // show only value, no serie name
        });
    
        // threshold line
    
        // threshold tooltip

        if (threshold_max < 0) {
            thresholdsHover.x.push(serie);
            thresholdsHover.y.push(threshold_min);
            thresholdsHover.text.push('<b>Max: </b>' + numbertoCurrency(threshold_max) + '<br><b>Min: </b>' + numbertoCurrency(threshold_min))
            ++nunSerie;
        }
        else {
            thresholdsHover.x.push(serie);
            thresholdsHover.y.push(threshold_max);
            thresholdsHover.text.push('<b>Max: </b>' + numbertoCurrency(threshold_max) + '<br><b>Min: </b>' + numbertoCurrency(threshold_min))
            ++nunSerie;
        }


    }
    
    data.push(thresholdsHover);    
    
    return Plotly.newPlot('cost', data, {
        font: {
            family: 'Nunito',
            size: 12,
            color: '#7f7f7f'
        },
        hoverlabel: {
            font: {
                family: 'Nunito',
            }
        },
        margin: {
            autoexpand: true,
            b: 0,
            t: 10,
            l: 35,
            r: 0
        },
        xaxis : {
            zeroline:false, 
            showline: false,
        },
        yaxis : {
            zeroline:false, 
            hoverformat: '.1f' ,// float precision
            tickformat: "$,~s"
        },
        showlegend: false
    },
    {
        scrollZoom: false,
        hoverFormat: '.2f',
        displayModeBar: false,
        responsive: true
    },
    )
}