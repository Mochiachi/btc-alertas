const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = require("../config");

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

function sendTelegram(msg) {
    return bot.sendMessage(TELEGRAM_CHAT_ID, msg);
}

module.exports = { sendTelegram };
