import React from 'react'
import { Row } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import EcgSignalPlot from './EcgSignalPlot.jsx'

const ecgSegmentLength = 10


export default class EcgViewer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sliderCurrentValue: 0,
      sliderStep: this.props.fs / 10,
      sliderMax: this.props.signal.length - ecgSegmentLength * this.props.fs,
      sliderMin: 0,
      sliderOnPlay: false
    }
  }

  sliderChangeValue (value) {
    this.setState({sliderCurrentValue: value.target.value})
  }

  render () {
    return (
      <div className='ecg-container'>
        <Row className='center-view'>
          <EcgSignalPlot signal={this.props.signal}
            fs={this.props.fs}
            annotation={this.props.annotation}
            start={this.state.sliderCurrentValue}
            length={ecgSegmentLength * this.props.fs}
            width={this.props.width * 0.8}
            height={this.props.height * 0.4} />
        </Row>
        <Row>
          <ReactBootstrapSlider value={this.state.sliderCurrentValue}
            step={this.state.sliderStep}
            max={this.state.sliderMax}
            min={this.state.sliderMin}
            change={this.sliderChangeValue.bind(this)}
          />
        </Row>
      </div>
    )
  }
}
