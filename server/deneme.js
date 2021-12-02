const text = 'ışıkları açar mısın'
const words = text.split(' ')
const features = [
  {
    id: 0,
    name: 'togglOn',
    keywords: ['aç', 'açar', 'açıl', 'kapa', 'kapat', 'kapatır', 'kapan'],
  },
  {
    id: 1,
    name: 'togglOff',
    keywords: ['kapa', 'kapat', 'kapatır', 'kapan'],
  },
]

const indexOfFeature = features
  .map((feature, index) => {
    const intersection = feature.keywords.filter((element) =>
      words.includes(element)
    )
    return intersection.length > 0 ? index : false
  })
  .sort()[0]
console.log(features[indexOfFeature])
