const vosk = require('vosk')
const fs = require('fs')
const mic = require('mic')
const commands = require('./commands')
const contacts = require('./contacts')
let start, end, time, voiceInput, result, command, mentioned, sentenceInput

const MODEL_PATH = './model/vosk-model-small-tr-0.3'
const SAMPLE_RATE = 16000

class Voice {
  constructor() {
    console.log('init')
    this.onStateChange = null

    if (!fs.existsSync(MODEL_PATH)) {
      console.log(
        'Please download the model from https://alphacephei.com/vosk/models and unpack as ' +
          MODEL_PATH +
          ' in the current folder.'
      )
      process.exit()
    }

    vosk.setLogLevel(-1)
    const model = new vosk.Model(MODEL_PATH)

    this.rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE })
    this.micInstance = mic({
      rate: String(SAMPLE_RATE),
      channels: '1',
      debug: false,
    })
    this.micInputStream = this.micInstance.getAudioStream()
    this.micInstance.start()

    //States
    this.status = {
      isWoke: true,
      command: false,
      isListening: false,
      mentioned: false,
      text: false,
      time: false,
    }
  }
  resetStatus = () => {
    this.status.command = this.status.mentioned = this.status.text = false
  }
  //Evoked by index.js
  onWakeUp = (_data) => {
    start = new Date().getTime()
    this.micInputStream.on('data', (data) => {
      end = new Date().getTime()
      time = Math.floor((end - start) / 1000)
      this.status.time = time

      if (time <= 5) {
        // this.status.isWoke = true
        console.log(this.status)
      } else {
        // this.status.isWoke = false
        // this.resetStatus()
        // this.status.text = false
        // _data(this.status)
      }

      if (this.rec.acceptWaveform(data)) {
        result = this.rec.result()
        result.text ? (this.status.text = result.text) : false

        command = commands.compareCommands(result.text)
        command.tags ? (this.status.command = command) : false

        mentioned = contacts.findPerson(result.text)
        mentioned.chatID ? (this.status.mentioned = mentioned) : false
        console.log(result.text)

        if (this.status.isWoke) {
          if (this.status.isListening) {
            if (result.text) {
              _data(this.status)
              this.status.isListening = false
              this.resetStatus()
            } else false
          } else {
            switch (command.tags) {
              case 'listen':
                this.status.text = false
                this.status.isListening = true
                start = new Date().getTime()
                break
              case 'execute':
                if (result.text) {
                  _data(this.status)
                  this.status.isListening = false
                  this.resetStatus()
                }
                break
              default:
                console.log('Geçerli bir komut vermedin!')
                break
            }
          }
        } else {
          switch (command.tags) {
            case 'wake':
              start = new Date().getTime()
              _data(this.status)
              break
            default:
              break
          }
        }
        console.log(result)
      } else {
        // _data(this.status)
        // this.status.text = false
        // console.log(this.rec.partialResult())
      }
    })
  }
}
const voiceInstance = new Voice()

module.exports = voiceInstance
