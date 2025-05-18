// initializeOiStore.js
const { fetchOpenInterestData } = require("../functions/oi/fetch-oi-data.js");
const { setOICache, VALID_TIMEFRAMES } = require("../functions/oi/oi-cache.js");

const DEFAULT_LIMIT = 52;

/**
 * Fetches open interest data and fills the cache for every supported timeframe.
 * @param {number} [limit=DEFAULT_LIMIT]  Number of candles to fetch per timeframe
 */
async function initializeOpenInterestStore() {
  for (const timeframe of VALID_TIMEFRAMES) {
    try {
      // 1) Fetch fresh OI payload
      const payload = await fetchOpenInterestData(timeframe, DEFAULT_LIMIT);

      // 2) Store in the cache under that timeframe
      setOICache(timeframe, payload);

      console.log(`✅ OI cache ${timeframe} → initialized...`);
    } catch (err) {
      console.error(`❌ Failed to initialize OI cache for ${timeframe}:`, err);
      throw err;
    }
  }
}

module.exports = { initializeOpenInterestStore };
