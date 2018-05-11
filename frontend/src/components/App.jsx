import React from 'react'
import { Component } from 'react'
import { Provider } from 'mobx-react'

import { ecgStore } from '../stores/stores'
import MainPage from './MainPage.jsx'


export default class App extends Component {
  render() {
    return (
    <Provider ecgStore={ecgStore}>
      <div>
        <MainPage />
      </div>
    </Provider>
    )
  }
}
