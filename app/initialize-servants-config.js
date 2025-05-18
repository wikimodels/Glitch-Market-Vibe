// app/initialize-app.js
const ServantsConfigOperator = require("../functions/global/servants/servants-config.js");

async function initializeServantsConfig() {
  await ServantsConfigOperator.initialize();
}

module.exports = { initializeServantsConfig };
