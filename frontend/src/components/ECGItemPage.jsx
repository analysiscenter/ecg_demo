import React from 'react'
import { Component } from 'react'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { Icon } from 'react-fa'
import { inject, observer } from 'mobx-react'

import LoadingSpinner from './LoadingSpinner.jsx'
import EcgSignalPlot from './EcgSignalPlot.jsx';
import EcgItemResults from './EcgItemResults.jsx'

import ReactBootstrapSlider from 'react-bootstrap-slider';


@inject("ecg_store")
@observer
export default class EcgItemPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewWindow: 10,
      sliderCurrentValue: 0,
      sliderStep: 1,
      sliderMax: 30,
      sliderMin: 0
    }
  }

  handleInference() {
    this.props.ecg_store.getInference(this.props.id)
  }

    renderPage(item) {
        const annotation = item.inference? [item.inference.qrs_segments, item.inference.p_segments, item.inference.t_segments] : null
        console.log("CHECK", this.state.sliderCurrentValue)
        return (
        <Row>
            { item.signal ?
                <EcgSignalPlot signal={item.signal}
                fs={item.frequency} annotation={annotation}
                start={this.state.sliderCurrentValue}
                length={this.state.viewWindow} />
              :
              'Loading signal'
            }
            { item.inference ?
                <Row>
                    <EcgItemResults pid={item.id}/>
                </Row>
            : null
            }

            { item.inference ? null :
                <Button bsStyle="success" className="get-inference" onClick={this.handleInference.bind(this)}>
                    { item.waitingInference ?
                        <Icon name="spinner" spin />
                      :
                        <span><Icon name="check-circle-o" /><span>Click to predict</span></span>
                    }
                </Button>
            }
        </Row>
        )
    }

    renderPageLoading() {
        return <LoadingSpinner text="Loading..." />
    }

  sliderChangeValue (value) {
    this.setState({sliderCurrentValue: value.target.value})
    // console.log(value.target.value)
  }

  render() {
    // const item = this.props.ecg_store.get(this.props.match.params.id)
    const item = this.props.ecg_store.get(this.props.id)
    // if (item !== undefined) {
    //   this.setState({})
    // }

    return (
      <div className="page ecg item">
        <Grid fluid>
          <Row>
            <Col xs={12}>
                <h2>Patient {(item != undefined) ? item.name : null}</h2>
            </Col>
          </Row>
          <Row>
            <ReactBootstrapSlider value={this.state.sliderCurrentValue}
              step={this.state.sliderStep}
              max={this.state.sliderMax}
              min={this.state.sliderMin} 
              change={this.sliderChangeValue.bind(this)}
            />
          </Row>
            {(item === undefined) ?
             this.renderPageLoading()
             :
             this.renderPage(item)
            }
            </Grid>
        </div>
        )
    }
}
