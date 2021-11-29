const telegramInstance = require('./telegram')
// const serialInstance = require('./serial')
const contacts = './contacts.js'
const contactsList = contacts.list

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
    botResponse: 'Komutlarını dinliyorum',
    execute: function () {
      console.log('Uyandım ve ', this.botResponse)
    },
    tags: 'wake',
  },
  {
    id: 2,
    name: 'telegram',
    description: 'Telegram features',
    keywords: ['mesaj', 'mesaj gönder', 'gönder'],
    contacts: contactsList,
    botResponse: 'Mesajın nedir?',
    execute: function () {
      console.log(this.botResponse)
    },
    sendSentence: function (msg, chatID) {
      telegramInstance.sendMsg(msg, chatID)
    },
    tags: 'listen',
  },
  {
    id: 3,
    name: 'Arduino',
    description: 'Arduino features',
    keywords: [
      // 'ışıklar',
      // 'ışık',
      // 'işık',
      // 'işıklar',
      // 'aç',
      // 'ışıkları',
      // 'ışıkları aç',
    ],
    execute: function () {
      serialInstance.write('on\n')
    },
    tags: 'execute',
  },
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
