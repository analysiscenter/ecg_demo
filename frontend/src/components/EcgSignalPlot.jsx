import React from 'react'

export default class EcgSignalPlot extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false
    }
  }

  componentDidMount () {
    MakePlot(this.props.signal,
      this.props.fs,
      this.props.annotation,
      this.props.start,
      this.props.length,
      this.props.width,
      this.props.height,
      'plot')
  }

  componentWillReceiveProps (nextProps) {
    MakePlot(nextProps.signal,
      nextProps.fs,
      nextProps.annotation,
      nextProps.start,
      nextProps.length,
      nextProps.width,
      nextProps.height,
      'plot')
  }

  render () {
    return (
      <div id='plot' className='center-view' />
    )
  }
}

function MakePlot (signal, fs, annotation, start, length, width, height, divId) {
  var pdata = [{
    x: Array.from(Array(signal.length).keys()).map(function (x) { return x / fs }).slice(start, start + length),
    y: signal.slice(start, start + length),
    type: 'scatter'
  }]

  var shapes = []
  if (annotation) {
    var colors = ['red', 'orange', 'blue']
    for (var k = 0; k < 3; k++) {
      var interval = annotation[k].slice()
      var begin = interval[0]
      var end = interval[1]
      for (var i = 0; i < begin.length; i++) {
        shapes.push({
          type: 'rect',
          xref: 'x',
          yref: 'paper',
          x0: begin[i] / fs,
          y0: 0,
          x1: end[i] / fs,
          y1: 1,
          fillcolor: colors[k],
          opacity: 0.2,
          line: {
            width: 0
          }
        })
      }
    }
    shapes = shapes.filter(seg =>
      ((seg.x0 * fs > start) &&
           (seg.x1 * fs < start + length)))
  }

  var layout = {
    margin: {
      t: 40
    },
    width: width,
    height: height,
    xaxis: {
      title: 'Время (сек)'
    },
    yaxis: {
      title: 'Амплитуда (мВ)',
      range: [Math.min(...signal), Math.max(...signal)]
    },
    font: {
      family: 'Roboto Condensed',
      weight: 100,
      size: 12,
      color: '#999999'
    },
    shapes: shapes
  }
  Plotly.react(divId, pdata, layout)
}
