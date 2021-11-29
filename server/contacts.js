exports.list = [
  //command fonksiyonu listenin 0. elemanını aldığı için yanlış atamalar oluyor
  //eğer keywordler uyuşmuyorsa 0.yı da alma demek lazım
  {
    id: 0,
    name: false,
    keywords: [],
    chatID: false,
  },
  ,
  {
    id: 1,
    name: 'Musa Kutlay Tunç',
    keywords: ['tunç', 'bana', 'kendime', "tunç'a", 'tunça'],
    birthday: 10101996,
    sex: 'm',
    chatID: 1369415266,
  },
  {
    id: 2,
    name: 'Mustafa Aslıvar',
    keywords: ['mustafa', 'mustafaya', "mustafa'ya", 'mustafaya'],
    chatID: 511054385,
  },
]

exports.findPerson = (input) => {
  const comparedList = this.list.map((contact, index) => {
    return {
      index: index,
      id: contact.id,
      matched: contact.keywords.filter((keyword) =>
        input.split(' ').includes(keyword)
      ).length,
    }
  })

  return this.list[
    comparedList.sort((a, b) => {
      return b.matched - a.matched
    })[0].index
  ]
}
