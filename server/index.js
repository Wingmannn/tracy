const voiceInstance = require('./voice')
const { Server } = require('socket.io')
const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('Connected')
  voiceInstance.onWakeUp((status, data, sentence, mentioned, tag) => {
    console.clear()
    console.log('deniz-----', status)
    socket.send(status)
    switch (tag) {
      case 'listen':
        data.sendSentence(sentence, mentioned)
        break
      case 'execute':
        data.execute()
        break
      default:
        break
    }
  })
})

io.listen(4242)

process.on('SIGINT', () => {
  console.log('Exiting NodeJS server')
  io.close()
})
