const { Telegraf } = require('telegraf')

require('dotenv').config()
class Telegram {
  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_TOKEN)
    this.bot.launch()
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  sendMsg = (response, chatId) => {
    this.bot.telegram.sendMessage(chatId, response)
  }
}

const telegramInstance = new Telegram()

module.exports = telegramInstance
