// initializeOiStore.js
const { setFundingRateCache } = require("../functions/fr/fr-cache.js");
const { fetchFundingRateData } = require("../functions/fr/fetch-fr-data.js");

const DEFAULT_LIMIT = 51;

async function initializeFundingRateStore() {
  try {
    // 1) Fetch fresh OI payload
    const payload = await fetchFundingRateData(DEFAULT_LIMIT);

    // 2) Store in the cache under that timeframe
    setFundingRateCache(payload);

    console.log(`✅ FR Cache → initialized...`);
  } catch (err) {
    console.error(`❌ Failed to initialize FR Cache for Funding Rate:`, err);
    throw err;
  }
}

module.exports = { initializeFundingRateStore };
