import React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { Icon } from 'react-fa'
import { inject, observer } from 'mobx-react'

import EcgItemPage from './ECGItemPage.jsx'


@inject("ecg_store")
@observer
export default class EcgPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pid: null,
      // sliderCurrentValue: 0,
      // sliderStep: 1,
      // sliderMax: null,
      // sliderMin: 0
    }
  }

  render() {
    if (this.state.pid === null) {
      let pid = this.props.ecg_store.items.keys()[0]
      // this.setState({pid: pid})
    }
    
        const self = this
        // const item = this.props.ecg_store.get(this.props.ecg_store.items.keys()[0])
        return (
        <div >
            <Grid fluid>
            <Row>
            <span className='headline centered-text'> Распознавание ЭКГ </span>
          </Row>
            
            <Row>
              <EcgItemPage id={this.props.ecg_store.items.keys()[0]} />
            </Row>
            </Grid>
        </div>
        )
    }
}
