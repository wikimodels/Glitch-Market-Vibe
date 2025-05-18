// app/initialize-app.js
const { initializeCoinsCache } = require("../coins/functions/coins-service.js");

async function initializeCoinsStore() {
  await initializeCoinsCache();
  console.log("✅ Coins Store → initialized...");
}

module.exports = { initializeCoinsStore };
