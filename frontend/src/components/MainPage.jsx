import React from 'react'
import { Grid, Row, Button } from 'react-bootstrap'
import { Icon } from 'react-fa'
import { inject, observer } from 'mobx-react'

import EcgViewer from './EcgViewer.jsx'
import EcgItemResults from './EcgItemResults.jsx'

@inject("ecgStore")
@observer
export default class MainPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pid: 0,
      browserWidth: 0,
      browserHeight: 0
    }
  }

  handleLeft () {
    this.setState({pid: (6 + this.state.pid - 1) % 6})
  }
  handleRight () {
    this.setState({pid: (this.state.pid + 1) % 6})
  }

  itemHasSignal (item) {
    if (item === undefined) {
      return false
    } else {
      return (item.signal !== null)
    }
  }

  itemHasInference (item) {
    if (item === undefined) {
      return false
    } else {
      return (item.inference !== null)
    }
  }

  itemWaitInference (item) {
    if (item === undefined) {
      return false
    } else {
      return !!(item.waitingInference)
    }
  }

  handleInference (id) {
    this.props.ecgStore.getInference(id)
  }

  updateDimensions () {
    this.setState({browserWidth: window.innerWidth,
      browserHeight: window.innerHeight})
  }

  componentDidMount () {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  render () {
    const item = this.props.ecgStore.get(this.props.ecgStore.items.keys()[this.state.pid])
    const annotation = this.itemHasInference(item) ? [item.inference.qrs_segments, item.inference.p_segments, item.inference.t_segments] : null
    return (
      <div className='page'>
        <Grid fluid>
          <Row>
            <span className='headline centered-text'> Расшифровка ЭКГ </span>
          </Row>
          <Icon name='angle-left'
            className='left-arrow'
            onClick={this.handleLeft.bind(this)} />
          <Icon name='angle-right'
            className='right-arrow'
            onClick={this.handleRight.bind(this)} />
          <span className='ecg-name'>ЭКГ {this.state.pid + 1}</span>
          { (this.itemHasSignal(item))
            ? <EcgViewer signal={item.signal}
              annotation={annotation}
              fs={item.frequency}
              width={this.state.browserWidth}
              height={this.state.browserHeight}
              key={this.state.pid} />
            : <div className='ecg-container' />
          }
          <Row>
            { (this.itemHasInference(item))
              ? <EcgItemResults item={item} />
              : <Button bsStyle='success'
                className='get-inference'
                onClick={() => this.handleInference(item.id)}>
                { (this.itemWaitInference(item))
                  ? <Icon name='spinner' spin />
                  : 'Нажмите для расшифровки'
                }
              </Button>
            }
          </Row>
        </Grid>
      </div>
    )
  }
}
