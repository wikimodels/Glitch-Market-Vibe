const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 0 }); // No TTL (persists in-memory until manually cleared)
const FAILED_PERP_KEY = "failedBinancePerpCoins";

// Add a failed coin (if not already present)
function addFailedBinancePerpCoin(symbol) {
  const current = cache.get(FAILED_PERP_KEY) || [];
  if (!current.includes(symbol)) {
    current.push(symbol);
    cache.set(FAILED_PERP_KEY, current);
  }
}

// Add multiple failed coins at once
function addFailedBinancePerpCoins(symbols) {
  const current = cache.get(FAILED_PERP_KEY) || [];
  const updated = [...new Set([...current, ...symbols])];
  cache.set(FAILED_PERP_KEY, updated);
}

// Get current list of failed Perp coins
function getFailedBinancePerpCoins() {
  return cache.get(FAILED_PERP_KEY) || [];
}

// Clear all failed coins
function clearFailedBinancePerpCoins() {
  cache.del(FAILED_PERP_KEY);
}

module.exports = {
  addFailedBinancePerpCoin,
  addFailedBinancePerpCoins,
  getFailedBinancePerpCoins,
  clearFailedBinancePerpCoins,
};
