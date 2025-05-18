const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 0 }); // Optional TTL: 1 hour
const FAILED_SPOT_KEY = "failedBinanceSpotCoins";

// Add a failed coin (if not already present)
function addFailedBinanceSpotCoin(symbol) {
  const current = cache.get(FAILED_SPOT_KEY) || [];
  if (!current.includes(symbol)) {
    current.push(symbol);
    cache.set(FAILED_SPOT_KEY, current);
  }
}

// Add multiple failed coins at once
function addFailedBinanceSpotCoins(symbols) {
  const current = cache.get(FAILED_SPOT_KEY) || [];
  const updated = [...new Set([...current, ...symbols])];
  cache.set(FAILED_SPOT_KEY, updated);
}

// Get current list of failed spot coins
function getFailedBinanceSpotCoins() {
  return cache.get(FAILED_SPOT_KEY) || [];
}

// Clear all failed coins
function clearFailedBinanceSpotCoins() {
  cache.del(FAILED_SPOT_KEY);
}

module.exports = {
  addFailedBinanceSpotCoin,
  addFailedBinanceSpotCoins,
  getFailedBinanceSpotCoins,
  clearFailedBinanceSpotCoins,
};
