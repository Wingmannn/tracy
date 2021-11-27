const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const parser = new Readline({ delimiter: '\r\n' })

class Serial {
  constructor() {
    this.port = new SerialPort('/dev/tty.KULAK-DevB', {
      baudRate: 9600,
    })

    this.port.pipe(parser)
  }

  write = (msg) => {
    this.port.write(msg + '\n', function (err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
    })
  }

  onMessage = (_data) => {
    //callback
    parser.on('data', (message) => {
      _data(message)
    })
  }

  onError = (_error) => {
    this.port.on('error', function (err) {
      console.log('Error: ', err.message)
      _error(err)
    })
  }
}

const serialInstance = new Serial()

module.exports = serialInstance
