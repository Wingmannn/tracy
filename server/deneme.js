const Lookup = require('node-yeelight-wifi').Lookup

let look = new Lookup()

manage = () => {
  look.on('detected', (light) => {
    console.log('new yeelight detected: id=' + light.id + ' name=' + light.name)

    console.log(light.power, light.id, 'sdkjasdasdklsajlşsak')
    light
      .setPower(true)
      .then(() => {
        console.log('success')
      })
      .catch((error) => {
        console.log('failed')
      })

    // console.log(light.power, light.id)
    // light
    //   .setPower(false)
    //   .then(() => {
    //     console.log('success', light)
    //   })
    //   .catch((error) => {
    //     console.log('failed', error)
    //   })
  })
}

manage()
