const telegramInstance = require('./telegram')
const bulbInstance = require('./bulb')
// const serialInstance = require('./serial')
const contacts = './contacts.js'
const contactsList = contacts.list

function randomPositiveResponse(obj) {
  return obj.botResponse.positive[
    Math.floor(Math.random() * obj.botResponse.positive.length)
  ]
}

exports.list = [
  //command fonksiyonu listenin 0. elemanını aldığı için yanlış atamalar oluyor
  //eğer keywordler uyuşmuyorsa 0.yı da alma demek lazım
  {
    id: 0,
    name: false,
    keywords: [],
    tags: false,
  },
  {
    id: 1,
    name: 'wake Up',
    description: 'Wake up words',
    keywords: ['uyan', 'hey', 'dinle', 'hey dinle', 'hey uyan'],
    botResponse: {
      positive: [
        'komutlarını dinliyorum',
        'seni dinliyorum',
        'hıhı...',
        'selam tunç, seni dinliyorum',
      ],
      negative: false,
    },
    execute: function () {
      console.log(randomPositiveResponse(this))
    },
    tags: 'wake',
  },
  {
    id: 2,
    name: 'telegram',
    description: 'Telegram features',
    keywords: ['mesaj', 'mesaj gönder', 'gönder'],
    contacts: contactsList,
    botResponse: {
      positive: [
        'Mesajını gönderdim',
        'Mesajını ilettim',
        'Tamamdır',
        'Gönderdim',
      ],
      negative: false,
    },
    execute: function () {},
    sendSentence: function (msg, chatID) {
      telegramInstance.sendMsg(msg, chatID)
      console.log(randomPositiveResponse(this))
    },
    tags: 'listen',
  },

  {
    id: 3,
    name: 'Smart Bulbs',
    description: 'Smart bulb features ',
    keywords: ['ışık', 'ışıklar', 'ışıkları', 'işık', 'işıklar', 'işıkları'],
    botResponse: {
      positive: [
        'Mesajını gönderdim',
        'Mesajını ilettim',
        'Tamamdır',
        'Gönderdim',
      ],
      negative: false,
    },
    execute: function (text) {
      bulbInstance.manage(text)
      console.log(randomPositiveResponse(this) + text)
    },
    tags: 'execute',
  },
  // {
  //   id: 4,
  //   name: 'Arduino',
  //   description: 'Arduino features',
  //   keywords: [
  //     // 'ışıklar',
  //     // 'ışık',
  //     // 'işık',
  //     // 'işıklar',
  //     // 'aç',
  //     // 'ışıkları',
  //     // 'ışıkları aç',
  //   ],
  //   execute: function () {
  //     serialInstance.write('on\n')
  //   },
  //   tags: 'execute',
  // },
]

exports.compareCommands = (voiceKeywords) => {
  const comparedList = this.list.map((command, index) => {
    return {
      index: index,
      id: command.id,
      matched: command.keywords.filter((keyword) =>
        voiceKeywords.split(' ').includes(keyword)
      ).length, //di mi
    }
  })
  return this.list[
    comparedList.sort((a, b) => {
      return b.matched - a.matched
    })[0].index
  ]
}
