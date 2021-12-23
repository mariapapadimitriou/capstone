Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';


new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
      labels: ["Cost","Ridership","Emissions","Traffic Volume","Safety"],
      datasets: [{ 
          data: [0.8,0.3,0.7,0.7,0.76],
          label: "Route 1 Sharrows",
          borderColor: "#4e73df",
          backgroundColor: "#4e73df",
          fill: false
        }, { 
          data: [0.5,0.3,1,0.4,0.88],
          label: "Route 1 Striped",
          borderColor: "#1cc88a",
          backgroundColor: "#1cc88a",
          fill: false
        }, { 
          data: [0.58,0.73,0.47,0.17,0.69],
          label: "Route 1 Protected",
          borderColor: "#36b9cc",
          backgroundColor: "#36b9cc",
          fill: false
        }
      ]
    },
    options: {
      elements: {
        line: {
            tension: 0
        }
      },
      title: {
        display: false,
        text: 'World population per region (in millions)'
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