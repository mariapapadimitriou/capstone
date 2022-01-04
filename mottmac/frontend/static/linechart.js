Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function getMultiObjective(plot_colours, plot_labels, plot_data) {

  console.log(plot_data)
  
  data = []

  for (let i=0; i < plot_labels.length; i++) {

    data.push(
      {
        x: ["Cost", "Ridership", "Safety"],
        y: plot_data[i],
        error_y: {
          type: 'data',
          symmetric: false,
          array: [1, 2, 1],
          arrayminus: [0.2, 0.4, 1, 0.2],
          visible: true
        },
        type: 'line',
        marker: {
          color: plot_colours[i],
          size: 10
        },
        hoverinfo: "skip", // show only value, no serie name
      }
    )
  }

  var layout = {
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
            b: 30,
            t: 10,
            l: 30,
            r: 0
        },
        xaxis : {
            zeroline:false, 
        },
        yaxis : {
            zeroline:false, 
            hoverformat: '.1f', // float precision
        },
        showlegend: false
    }
  return Plotly.newPlot('myChart', data, layout, {displayModeBar: false});
}