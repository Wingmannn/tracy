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
      isListening: false,
      listener: false, //returns command object
      listenerTag: false,
      mentioned: false,
      mentionedID: false,
      time: false,
    }
  }

  //Evoked by index.js
  onWakeUp = (_data) => {
    //Timer starts
    start = new Date().getTime()

    //Mic is starting to record
    this.micInputStream.on('data', (data) => {
      end = new Date().getTime()
      time = Math.floor((end - start) / 1000) //Passed seconds
      this.status.time = time

      voiceInput = this.rec.partialResult().partial //Updates as you speak

      this.status.isWoke = time <= 5 ? true : false //Sleep timer

      //Debugging purposes
      // console.log({
      // woke: this.status.isWoke,
      // isListening: this.status.isListening,
      // mentioned: this.status.mentioned ? this.status.mentioned : false,
      // listener: this.status.listener ? this.status.listener.name : null,
      // time: time,
      // })

      if (this.rec.acceptWaveform(data)) {
        //If any listeners is active, Tracy listens for full sentence
        if (this.status.isListening) {
          console.log('Dinliyorum')
          result = this.rec.result()
          sentenceInput = result.text

          //Callbacks to index.js with essential parameters
          sentenceInput
            ? _data(
                this.status,
                this.status.listener,
                sentenceInput,
                this.status.mentionedID,
                this.status.listenerTag
              )
            : console.log('Hiçbir şey demedin!')

          //States resets
          this.status.listener =
            this.status.isListening =
            this.status.mentioned =
            this.status.mentionedID =
            this.status.listenerTag =
              false
        } else {
          if (this.status.isWoke) {
            //Tracy is woke, listens for commands
            result = this.rec.result()
            command = commands.compareCommands(voiceInput) //Command found
            mentioned = contacts.findPerson(voiceInput) //Assigned if there is mentioned person

            //When sentence ends it will update states
            if (result.text) {
              this.status.mentioned = mentioned.name
              this.status.mentionedID = mentioned.chatID
              start = new Date().getTime()
            }
            //Looks for command's tag to behave as intended
            switch (command.tags) {
              case 'listen':
                //Listener is active, updating state
                this.status.listener = command
                this.status.listenerTag = command.tags
                this.status.isListening = true
                break
              case 'execute':
                //No listeners, commands executes directly
                result = this.rec.result()
                command = commands.compareCommands(voiceInput)
                _data(this.status, command)
                break
              default:
                console.log('Tag bulunamadı!')
            }
          } else {
            //Tracy is sleeping, waiting for Wake-Up word
            this.status.mentioned = false //In case of any unused mentioning
            result = this.rec.result()
            command = commands.compareCommands(voiceInput)

            //Wake-Up word catched above, tag used below
            switch (command.tags) {
              case 'wake':
                start = new Date().getTime()
                _data(this.status, command)
                break
              default:
                break
            }
          }
        }
      }
      _data(this.status, command)
    })
  }
}
const voiceInstance = new Voice()

module.exports = voiceInstance
