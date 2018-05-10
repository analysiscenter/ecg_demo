import Server from './server'
import ECG_Store from './ecg_store'

const server = new Server()
server.init()
const ecg_store = new ECG_Store(server)

export { server, ecg_store}
