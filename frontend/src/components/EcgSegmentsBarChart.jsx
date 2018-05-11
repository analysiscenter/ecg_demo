import React from 'react'
import { Bar } from 'react-chartjs-2'
import { inject, observer } from 'mobx-react'

const options = {
  legend: { display: false },
  title: { display: false },
  font: {
    family: 'Roboto Condensed',
    weight: 100,
    size: 12,
    color: '#999999'
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 12,
        max: 0.5
      },
      scaleLabel: {
        display: true,
        labelString: 'Длительность (сек)'
      }
    }],
    xAxes: [{
      ticks: {
        fontSize: 12
      }
    }]
  },
  maintainAspectRatio: false,
  responsive: true,

  events: false,
  tooltips: { enabled: false },
  animation: {
    duration: 1,
    onComplete: function () {
      var chartInstance = this.chart
      var ctx = chartInstance.ctx
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily)
      ctx.fillStyle = '#999999'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'

      this.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i)
        meta.data.forEach(function (bar, index) {
          var data = Math.round(dataset.data[index] * 100) / 100
          ctx.fillText(data, bar._model.x, bar._model.y - 5)
        })
      })
    }
  }
}


export default class EcgSegmentsBarChart extends React.Component {
  render () {
    const item = this.props.item
    const segments = [item.inference.qrs_interval, item.inference.qt_interval, item.inference.pq_interval]
    options.scales.yAxes[0].ticks.max = 1.2 * Math.max(...segments)

    let data = {
      labels: ['QRS', 'QT', 'PQ'],
      datasets: [
        {
          data: segments,
          backgroundColor: ['rgba(255,19,12,0.2)', 'rgba(255,19,132,0.2)', 'rgba(55,99,192,0.2)']
        }
      ]
    }

    return (
      <Bar data={data} options={options} />
    )
  }
}
