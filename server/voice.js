const vosk = require('vosk')
const fs = require('fs')
const mic = require('mic')
const commands = require('./commands')
const contacts = require('./contacts')
let start, end, time, partial, result, command, mentioned, sentenceInput

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
      //device: 'default', -----rasp için
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
      partial: false,
      time: false,
    }
  }

  //Evoked by index.js
  onWakeUp = (_data, _dataForClient) => {
    start = new Date().getTime()
    this.micInputStream.on('data', (data) => {
      end = new Date().getTime()
      time = Math.floor((end - start) / 1000)
      this.status.time = time
      _dataForClient(this.status)

      if (time <= 5) {
        // console.log(this.status)
      } else {
        this.status.isWoke =
          this.status.command =
          this.status.isListening =
          this.status.mentioned =
          this.status.text =
            false
        _data(this.status)
        // console.log(this.status)
      }
      //Partial result for the UI
      partial = this.rec.partialResult()
      partial.partial ? (this.status.partial = partial.partial) : false

      if (this.rec.acceptWaveform(data)) {
        //If there is a full sentence(result) assigns it to status.text
        result = this.rec.result()
        result.text ? (this.status.text = result.text) : false

        //Looking for command & mentioned people in that sentence
        command = commands.compareCommands(result.text)
        command.tags ? (this.status.command = command) : false

        //If there is a full sentence(result) assigns it to status.text
        mentioned = contacts.findPerson(result.text)
        mentioned.chatID ? (this.status.mentioned = mentioned) : false

        if (this.status.isWoke) {
          if (this.status.isListening) {
            if (result.text) {
              _data(this.status)
              _dataForClient(this.status)
              this.status.isListening =
                this.status.command =
                this.status.mentioned =
                this.status.text =
                  false
            }
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
                  _dataForClient(this.status)
                  start = new Date().getTime()
                  this.status.isListening =
                    this.status.command =
                    this.status.mentioned =
                    this.status.text =
                      false
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
              this.status.isWoke = true
              _dataForClient(this.status)
              start = new Date().getTime()
              break
            default:
              break
          }
        }
        // console.log('Burası her 5 saniyede bir çalışıyor ', this.status.time)
      }
    })
  }
}
const voiceInstance = new Voice()

module.exports = voiceInstance
