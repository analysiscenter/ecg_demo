import keyMirror from 'fbjs/lib/keyMirror'

const SocketIOEvents = {
  CONNECTING: 'connecting',
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  DISCONNECT: 'disconnect',
  RECONNECTING: 'reconnecting',
  RECONNECT: 'reconnect'
}

const ServerEvents = keyMirror({
  SERVER_READY: null
})

const ECG_Requests = keyMirror({
  ECG_GET_LIST: null,
  ECG_GET_ITEM_DATA: null,
  ECG_GET_INFERENCE: null
})

const ECG_Responses = keyMirror({
  ECG_GOT_LIST: null,
  ECG_GOT_ITEM_DATA: null,
  ECG_GOT_INFERENCE: null
})

const ECG_API = Object.assign({}, ECG_Responses, ECG_Requests)

const API_Requests = Object.assign({}, ECG_Requests)
const API_Responses = Object.assign({}, ECG_Responses)

const API_Events = Object.assign({}, API_Requests, API_Responses)

const Events = Object.assign({}, SocketIOEvents, ServerEvents, API_Events)

export { Events, SocketIOEvents, ServerEvents, API_Events, API_Responses, API_Requests, ECG_API, ECG_Responses, ECG_Requests}
