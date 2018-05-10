import React from 'react';
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon } from 'react-fa'
import { Grid, Row, Col } from 'react-bootstrap'

import EcgSegmentsBarChart from './EcgSegmentsBarChart.jsx'
import CircularProgressbar from 'react-circular-progressbar'


@inject("ecg_store")
@observer
export default class EcgItemResults extends Component {


    render() {
        const item = this.props.ecg_store.get(this.props.pid)

        return (
            <div className="heart">
                <Col xs={6} sm={3}>
                    <h3>Heart beat rate</h3>
                    <div className="heart-rate">
                        <Icon name='heartbeat' />
                        <span>{ Math.round(item.inference.heart_rate) + ' bpm' }</span>
                    </div>
                </Col>
                <Col xs={6} sm={3}>
                    <h3>AF probability</h3>
                    <Col xs={8} xsOffset={2}>
                        <CircularProgressbar percentage={Math.round(item.inference.af_prob * 100)} initialAnimation />
                    </Col>
                </Col>
                <Col sm={6}>
                    <h3>Segments</h3>
                    <EcgSegmentsBarChart pid={this.props.pid}/>
                </Col>
            </div>
        )
    }
}
