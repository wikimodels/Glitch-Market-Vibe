// initializeOiStore.js
const ServantsConfigOperator = require("../../functions/global/servants/servants-config.js");
const { fetchKlineData } = require("../functions/fetch-kline-data.js");
const { setKlineCache, VALID_TIMEFRAMES } = require("./kline-cache.js");
const {
  runWithOptionalDelay,
} = require("../../functions/shared/delay/run-with-optional-delay.js");

async function initializeKlineStore() {
  const limit = ServantsConfigOperator.getConfig().limitKline;
  for (const timeframe of VALID_TIMEFRAMES) {
    runWithOptionalDelay(timeframe, async () => {
      try {
        const payload = await fetchKlineData(timeframe, limit);
        setKlineCache(timeframe, payload);
        console.log(`✅ Kline cache ${timeframe} → initialized...`);
      } catch (err) {
        console.error(
          `❌ Failed to initialize Kline Cache for ${timeframe}:`,
          err
        );
      }
    });
  }
}

module.exports = { initializeKlineStore };
