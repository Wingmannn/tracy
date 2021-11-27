const { Telegraf } = require('telegraf')
const selfCtx = {
  fromID: 1369415266,
  chatID: 1369415266,
}

require('dotenv').config()
class Telegram {
  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_TOKEN)
    this.bot.launch()
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  listenTG = (msg, response) => {
    if (msg === 'listening') {
      this.bot.telegram.sendMessage(selfCtx.chatID, response)
    }
  }
  sendMsg = (response, chatId) => {
    this.bot.telegram.sendMessage(chatId, response)
  }
}

const telegramInstance = new Telegram()

module.exports = telegramInstance
