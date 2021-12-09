const Lookup = require('node-yeelight-wifi').Lookup

class Bulb {
  constructor() {
    this.myBulbs = {
      avze: '0x000000001be4c1a9',
      masa: '0x000000001bf9509e',
    }
    this.foundedBulbs = []

    this.features = [
      {
        id: 0,
        name: 'no feature',
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
      {
        id: 3,
        name: 'turnRed',
        keywords: ['kırmızı', 'kızıl', 'kızart', 'kırmızıya', 'kızıla'],
      },
      {
        id: 4,
        name: 'turnGreen',
        keywords: ['yeşil', 'yeşile'],
      },
      {
        id: 4,
        name: 'turnBlue',
        keywords: ['mavi', 'maviye'],
      },
    ]
    this.look = new Lookup()
    this.look.on('detected', (light) => {
      this.foundedBulbs.push(light)
    })
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
    if (!feature) {
      return
    }
    if (this.foundedBulbs.length < 1) {
      this.look = new Lookup()
      this.look.on('detected', (light) => {
        this.foundedBulbs.push(light)
      })
    } else {
      this.foundedBulbs.forEach((light) => {
        switch (light.id === this.myBulbs.masa) {
          case feature.name === 'toggleOn' && light.power === false:
            light
              .setPower(true)
              .then(() => {
                console.log('success', light)
              })
              .catch((error) => {
                console.log('failed', error)
              })
            break
          case feature.name === 'toggleOff' && light.power === true:
            light
              .setPower(false)
              .then(() => {
                console.log('success', light)
              })
              .catch((error) => {
                console.log('failed', error)
              })
            break
          case feature.name === 'turnRed':
            //BURADAN DEVAM KUANK
            break
          case feature.name === 'turnGreen':
            //BURADAN DEVAM KUANK
            break
          case feature.name === 'turnBlue':
            //BURADAN DEVAM KUANK
            break
          default:
            break
        }
        // if (light.id === this.myBulbs.masa) {
        //   if (feature.name === 'toggleOn' && light.power === false) {
        //     light
        //       .setPower(true)
        //       .then(() => {
        //         console.log('success', light)
        //       })
        //       .catch((error) => {
        //         console.log('failed', error)
        //       })
        //   } else if (feature.name === 'toggleOff' && light.power === true) {
        //     light
        //       .setPower(false)
        //       .then(() => {
        //         console.log('success', light)
        //       })
        //       .catch((error) => {
        //         console.log('failed', error)
        //       })
        //   } else {
        //     console.log('There is no such a feature')
        //   }
        // }
      })
    }

    // this.look.on('detected', (light) => {
    //   if (light.id === this.myBulbs.masa) {
    //     if (feature.name === 'toggleOn' && light.power === false) {
    //       light
    //         .setPower(true)
    //         .then(() => {
    //           console.log('success', JSON.stringify(light))
    //         })
    //         .catch((error) => {
    //           console.log('failed', error)
    //         })
    //     } else if (feature.name === 'toggleOff' && light.power === true) {
    //       light
    //         .setPower(false)
    //         .then(() => {
    //           console.log('success', light)
    //         })
    //         .catch((error) => {
    //           console.log('failed', error)
    //         })
    //     } else {
    //       console.log('There is no such a feature')
    //     }
    //   }
    // })
  }
}

const bulbInstance = new Bulb()

module.exports = bulbInstance
