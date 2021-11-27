import io from 'socket.io-client'
class Socket {
  constructor() {
    this.socket = io('http://localhost:4242/')
    console.log('socket inişılayz')
  }
  onMessage = (_data) => {
    this.socket.on('message', (data) => {
      _data(data)
    })
  }
}

const socketInstance = new Socket()

export default socketInstance
