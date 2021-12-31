Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var myChart;

function getMultiObjective(plot_colours, plot_labels, plot_data) {

  var multi_data = []

  for (let i = 0; i < plot_colours.length; i++) {

    point = {
        data: plot_data[i],
        label: plot_labels[i],
        borderColor:  plot_colours[i],
        backgroundColor: plot_colours[i],
        fill: false
    }
    multi_data.push(point)
}
if (myChart) myChart.destroy();

myChart = new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
      labels: ["Cost","Ridership","Safety"],
      datasets: multi_data
    },
    options: {
      animation: {
        duration: 0
      },
      elements: {
        line: {
            tension: 0
        }
      },
      title: {
        display: false,
        text: 'Route Comparison'
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
    }
  });
}