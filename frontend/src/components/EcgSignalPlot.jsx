import React from 'react'
import { Component } from 'react'


export default class EcgSignalPlot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false
        }
    }

    componentDidMount() {
        if (this.props.signal) {
            MakePlot(this.props.signal,
                this.props.fs,
                this.props.annotation,
                this.props.start,
                this.props.length,
                'plot')
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.signal) {
            MakePlot(nextProps.signal,
                nextProps.fs,
                nextProps.annotation,
                nextProps.start,
                nextProps.length,
                'plot')
        }
    }

    render() {
        return (
            <div>
                <div id="plot"></div>
            </div>
        )
    }
}


function MakePlot(signal, fs, annotation, start, length, div_id) {
    var pdata = [{
        x: Array.from(Array(signal.length).keys()).map(function(x) { return x / fs; }).slice(start*fs, (start+length)*fs),
        y: signal.slice(),
        type: 'scatter'
    }];
    console.log(start*fs, (start+length)*fs)

    var shapes = [];
    if (annotation) {
        var colors = ['red', 'orange', 'blue'];
        for (var k = 0; k < 3; k++) {
            var interval = annotation[k].slice()
            var begin = interval[0];
            var end = interval[1];
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
    }

    var layout = {
        margin: {
           t: -0,
        },
        xaxis: {
        },
        yaxis: {
            title: 'Amplitude (mV)'
        },
        font: {
           family: 'Roboto Condensed',
           weight: 100,
           size: 12,
           color: '#999999'
        },
        shapes: shapes
    };

    Plotly.newPlot(div_id, pdata, layout);

function rand() {
  return Math.random();
}

var slayout = {
    xaxis: {
        range: [0, 300 * 5]
    },
    yaxis: {
        range: [Math.min(...signal), Math.max(...signal)]
    },
    };

// Plotly.plot(div_id, [{
//   y: signal.slice(0, 10)
// }], slayout);
var len = 300 * 5
// Plotly.react(div_id, [{y: signal.slice(0, len)}], slayout)


var cnt = 0;
// console.log(Math.min(...signal), Math.max(...signal), 1000 / fs)

// var interval = setInterval(function() {
//   cnt += 3;
//   // Plotly.extendTraces(div_id, {
//   //   y: [[signal[cnt]]]
//   // }, [0])
//   // console.log(cnt)
//   // Plotly.react(div_id, [{y: signal.slice(cnt, cnt + 100)}])
//   // Plotly.react(div_id, [{y: signal.slice(Math.max(0, cnt - 1000), cnt + 1)}], slayout)
//   Plotly.react(div_id, [{y: signal.slice(cnt, cnt + len)}], slayout)
//   if(cnt === 3000) clearInterval(interval);
// }, 10);

}
