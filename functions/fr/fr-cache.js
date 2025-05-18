// frCache.js
const NodeCache = require("node-cache");

// Initialize cache with no expiration (stdTTL: 0)
const frCache = new NodeCache({ stdTTL: 0 });

/**
 * Set the funding rate data in cache.
 * @param {Object} data - The funding rate data to cache.
 */
function setFundingRateCache(data) {
  frCache.set("fundingRate", data);
}

/**
 * Retrieve the funding rate data from cache.
 * @returns {Object|null} The cached funding rate data or null if not found.
 */
function getFundingRate() {
  return frCache.get("fundingRate") ?? null;
}

/**
 * Clear all entries from the funding rate cache.
 */
function clearFundingRate() {
  frCache.flushAll();
}

module.exports = {
  setFundingRateCache,
  getFundingRate,
  clearFundingRate,
};
