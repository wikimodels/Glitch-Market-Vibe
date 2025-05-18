// app/initialize-app.js
const ServantsConfigOperator = require("../functions/global/servants/servants-config.js");
const TelegramBotOperator = require("../functions/global/servants/tg-bot-operator.js");

async function initializeTelegramBots() {
  const config = ServantsConfigOperator.getConfig();
  await TelegramBotOperator.initialize(config);
}

module.exports = { initializeTelegramBots };
