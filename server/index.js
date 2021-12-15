const voiceInstance = require('./voice')
const { Server } = require('socket.io')
const io = new Server({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('Connected')
  voiceInstance.onWakeUp(
    (status) => {
      // console.clear()
      // console.log(status)
      if (status.command) {
        switch (status.command.tags) {
          case 'listen':
            status.text
              ? status.command.sendSentence(
                  status.text,
                  status.mentioned.chatID
                )
              : false
            break
          case 'execute' || 'wake':
            status.command.execute(status.text)
            break
          default:
            break
        }
      }
    },
    (dataForClient) => {
      console.log(dataForClient)
      socket.send(dataForClient)
    }
  )
})

io.listen(4242)

process.on('SIGINT', () => {
  console.log('Exiting NodeJS server')
  io.close()
})
