import React from 'react'
import { inject, observer } from 'mobx-react'
import { Icon } from 'react-fa'
import { Row, Col } from 'react-bootstrap'

import EcgSegmentsBarChart from './EcgSegmentsBarChart.jsx'
import CircularProgressbar from 'react-circular-progressbar'


export default class EcgItemResults extends React.Component {
  render () {
    const item = this.props.item

    return (
      <Row className='ecg-results'>
        <Col sm={4}>
          <h3>Пульс</h3>
          <div className='heart-rate'>
            <Icon name='heartbeat' />
            <span>{ Math.round(item.inference.heart_rate) + ' уд/мин' }</span>
          </div>
        </Col>
        <Col sm={4}>
          <h3>Риск мерцательной аритмии</h3>
          <Row className='center-view'>
            <CircularProgressbar percentage={Math.round(item.inference.af_prob * 100)} initialAnimation />
          </Row>
        </Col>
        <Col sm={4}>
          <h3>Сегменты</h3>
          <Row className='bar-chart'>
            <EcgSegmentsBarChart item={item} />
          </Row>
        </Col>
      </Row>
    )
  }
}
