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

  //Evoked by index.js
  onWakeUp = (_data) => {
    this.micInputStream.on('data', (data) => {
      if (rec.acceptWaveform(data)) {
        console.log(rec.result())
      } else {
        let b = 10
        console.log(rec.partialResult())
      }
    })
  }
}
const voiceInstance = new Voice()

module.exports = voiceInstance
