// server.js
require("dotenv").config();

const { initializeApp } = require("./app/initialize-app.js");

const { scheduleSelfPing } = require("./jobs/self-ping.js");

const {
  initializeServantsConfig,
} = require("./app/initialize-servants-config.js");

const { initializeTelegramBots } = require("./app/initialize-telegram-bots.js");

const {
  initializeCoinsStore,
} = require("./coins/functions/initialize-coins-store.js");

const {
  initializeKlineStore,
} = require("./kline/functions/initialize-kline-store.js");

//const { scheduleAllOiJobs } = require("./jobs/oi.js");

//const { scheduleAllFrJobs } = require("./jobs/fr.js");

const {
  setInitialColors,
} = require("./functions/shared/colors/colors-cache.js");
const { scheduleAllKlineJobs } = require("./kline/jobs/kline.js");

async function main() {
  try {
    await initializeServantsConfig();

    await initializeCoinsStore();
    //await initializeOpenInterestStore();
    //await initializeFundingRateStore();
    await initializeKlineStore();

    const app = await initializeApp();

    scheduleSelfPing();
    setInitialColors();
    //scheduleAllOiJobs();
    //scheduleAllFrJobs();
    scheduleAllKlineJobs();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✳️  Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application initialization failed:", error);
    process.exit(1);
  }
}

main();
