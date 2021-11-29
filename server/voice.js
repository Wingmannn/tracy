const vosk = require('vosk')
const fs = require('fs')
const mic = require('mic')
const commands = require('./commands')
const contacts = require('./contacts')
let start, end, time, voiceInput, result, command, mentioned, s

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
  resetStatus = (x) => {
    x === 'sleep' ? (this.status.isWoke = false) : false
    this.status.command =
      this.status.isListening =
      this.status.mentioned =
      this.status.text =
        false
  }

  //Evoked by index.js
  onWakeUp = (_data) => {
    //Timer starts
    start = new Date().getTime()

    //Mic is starting to record------------
    this.micInputStream.on('data', (data) => {
      end = new Date().getTime()
      time = Math.floor((end - start) / 1000) //Passed seconds
      this.status.time = time

      voiceInput = this.rec.partialResult().partial //Updates as you speak

      //Sleep timer and state reseter
      if (time <= 5) {
        this.status.isWoke = true
      } else {
        this.resetStatus('sleep')
      }

      //There is meaningful sound wave
      if (this.rec.acceptWaveform(data)) {
        //Listeners is active, Tracy listens for full sentence
        if (this.status.isListening) {
          result = this.rec.result()

          //Voice input is not empty, callbacks
          if (result.text.length > 0) {
            this.status.text = result.text
            _data(this.status)
          } else {
            console.log('Hiçbir şey demedin!')
          }

          //States resets
          this.resetStatus()
        } else {
          //Tracy is woke, listens for commands
          if (this.status.isWoke) {
            result = this.rec.result() //Soundwave caught
            result.text.length > 0 ? (this.status.text = result.text) : false //It is meaningful, updating status.text
            command = commands.compareCommands(voiceInput) //Checking for
            mentioned = contacts.findPerson(voiceInput) //Checking any mention
            mentioned.chatID ? (this.status.mentioned = mentioned) : false //status.mentioned updates based on mentioned.chatID
            command.tags ? (this.status.command = command) : false //status.command updates based on command.tags
            //When sentence ends it will update states
            if (result.text) {
              start = new Date().getTime() //Sometimes
              this.status.text = result.text
            }
            //Looks for command's tag to behave as intended
            switch (command.tags) {
              case 'listen':
                //Listener is active, updating state
                this.status.text = false
                this.status.isListening = true
                start = new Date().getTime()
                break
              case 'execute':
                //No listeners, commands executes directly
                result = this.rec.result()
                result.text.length > 0
                  ? (this.status.text = result.text)
                  : false
                command = commands.compareCommands(voiceInput)
                command.tags ? (this.status.command = command) : false
                _data(this.status)
                break
              default:
                console.log('Geçerli bir komut vermedin!')
            }
          } else {
            //Tracy is sleeping, waiting for Wake-Up word
            this.status.mentioned = false //In case of any unused mentioning

            result = this.rec.result()
            command = commands.compareCommands(voiceInput)
            command.tags ? (this.status.command = command) : false

            switch (command.tags) {
              case 'wake':
                start = new Date().getTime()
                _data(this.status)
                break
              default:
                break
            }
          }
        }
      }
      _data(this.status)
    })
  }
}
const voiceInstance = new Voice()

module.exports = voiceInstance
