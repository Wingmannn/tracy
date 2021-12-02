const Lookup = require('node-yeelight-wifi').Lookup

class Bulb {
  constructor() {
    this.myBulbs = {
      avze: '0x000000001be4c1a9',
      masa: '0x000000001bf9509e',
    }

    this.features = [
      {
        id: 0,
        name: '',
        keywords: [],
      },
      {
        id: 1,
        name: 'toggleOff',
        keywords: ['kapa', 'kapat', 'kapatır', 'kapan'],
      },
      {
        id: 2,
        name: 'toggleOn',
        keywords: ['aç', 'açar', 'açıl', 'kapa', 'kapat', 'kapatır', 'kapan'],
      },
    ]
  }

  feautureFinder = (sentence) => {
    const wordsList = sentence.split(' ')
    const indexOfFeature = this.features
      .map((feature, index) => {
        const intersection = feature.keywords.filter((element) =>
          wordsList.includes(element)
        )
        return intersection.length > 0 ? index : false
      })
      .sort()[0]

    return this.features[indexOfFeature]
  }

  manage = (text) => {
    const feature = this.feautureFinder(text)
    console.log(feature)
    this.look = new Lookup()
    this.look.on('detected', (light) => {
      if (light.id === this.myBulbs.masa) {
        if (feature.name === 'toggleOn') {
          light
            .setPower(true)
            .then(() => {
              console.log('success', light)
            })
            .catch((error) => {
              console.log('failed', error)
            })
        } else if (feature.name === 'toggleOff') {
          light
            .setPower(false)
            .then(() => {
              console.log('success', light)
            })
            .catch((error) => {
              console.log('failed', error)
            })
        }
      }
    })
  }
}

const bulbInstance = new Bulb()

module.exports = bulbInstance
