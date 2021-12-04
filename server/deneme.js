function randomPosRes(obj) {
  return obj.positive[Math.floor(Math.random() * obj.positive.length)]
}
let botResponse = {
  positive: ['Mesajını gönderdim', 'Mesajını ilettim', 'Tamamdır', 'Gönderdim'],
  negative: false,
  denem: function () {
    console.log(randomPosRes(this))
  },
}

botResponse.denem()
