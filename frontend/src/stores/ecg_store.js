import { observable, autorun, action, extendObservable } from 'mobx'

import { API_Events } from './const'

const itemTemplate = {
  id: null,
  signal: null,
  frequency: null,
  units: null,
  inference: null,
  waitingData: false,
  waitingInference: false
}

export default class EcgStore {
  server = null
  @observable ready = false
  @observable items = new Map()

  constructor (server) {
    this.server = server
    autorun(() => this.onConnect())
    this.server.subscribe(API_Events.ECG_GOT_LIST, this.onGotList.bind(this))
    this.server.subscribe(API_Events.ECG_GOT_ITEM_DATA, this.onGotItemData.bind(this))
    this.server.subscribe(API_Events.ECG_GOT_INFERENCE, this.onGotInference.bind(this))
  }

  onConnect () {
    if ((this.items.size === 0) & this.server.ready) {
      this.server.send(API_Events.ECG_GET_LIST)
    }
  }

  @action
  onGotList (data, meta) {
    data.map((item) => this.items.set(item.id, Object.assign({}, itemTemplate, item)))
    this.ready = true
  }

  @action
  onGotItemData (data, meta) {
    extendObservable(this.items.get(data.id), data)
    this.items.get(data.id).waitingData = false
  }

  @action
  onGotInference (data, meta) {
    extendObservable(this.items.get(data.id), data)
    this.items.get(data.id).waitingInference = false
  }

  getItemData (id) {
    const item = this.items.get(id)
    if (item !== undefined) {
      if (!item.waitingData) {
        item.waitingData = true
        this.server.send(API_Events.ECG_GET_ITEM_DATA, {id: id})
      }
    }
  }

  getInference (id) {
    if (!this.items.get(id).waitingInference) {
      this.items.get(id).waitingInference = true
      this.server.send(API_Events.ECG_GET_INFERENCE, {id: id})
    }
  }

  get (id) {
    const item = this.items.get(id)
    if (item !== undefined) {
      if (item.signal === null) { this.getItemData(id) }
    }
    return item
  }
}
