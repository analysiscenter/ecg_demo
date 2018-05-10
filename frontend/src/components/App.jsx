import React from 'react'
import { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Provider } from 'mobx-react'

import { ecg_store } from '../stores/stores'
import EcgPage from './ECGPage.jsx'
import ECGItemPage from './ECGItemPage.jsx'


export default class App extends Component {
  render() {
    return (
    <Provider ecg_store={ecg_store}>
        <Router>
        <div>
            <Switch>
                <Route exact path="/" component={EcgPage} />
                <Route path="/:id" component={ECGItemPage} />
            </Switch>
        </div>
        </Router>
    </Provider>
    )
  }
}
