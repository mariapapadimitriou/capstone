function getMultiObjective(plot_colours, plot_labels, plot_data) {
  
  data = [{
    x: ["Cost", "Ridership", "Saved Emissions", "Safety"],
    y: [0, 0, 0, 0],
    type: 'line',
    line: {
      width: 1
    },
    marker: {
      color: "#ECECEB",
      size: 10,
      opacity: 0
    },
    hoverinfo: "skip"
  }]

  mean_data = plot_data[0]
  add_data = plot_data[1]
  sub_data = plot_data[2]

  for (let i=0; i < plot_labels.length; i++) {

    data.push(
      {
        x: ["Cost", "Ridership", "Saved Emissions", "Safety"],
        y: mean_data[i],
        name: plot_labels[i],
        hoverinfo: "skip",
        error_y: {
          type: 'data',
          symmetric: false,
          array: add_data[i],
          arrayminus: sub_data[i],
          visible: true,
          opacity: 0.2,
          thickness: 4,
          width: 4,
          color: plot_colours[i]
        },
        type: 'line',
        line: {
          width: 4
        },
        marker: {
          color: plot_colours[i],
          size: 10
        },
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
            l: 0,
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
  return Plotly.newPlot('myChart', data, layout, {displayModeBar: false, responsive: true});
}