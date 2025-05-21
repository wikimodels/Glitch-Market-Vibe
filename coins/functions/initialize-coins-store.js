const { initializeCoinsCache } = require("./coins-service.js");

async function initializeCoinsStore() {
  await initializeCoinsCache();
  console.log("✅ Coins Store → initialized...");
}

module.exports = { initializeCoinsStore };
