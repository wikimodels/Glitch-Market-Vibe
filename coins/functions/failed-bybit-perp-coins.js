const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 0 }); // Optional TTL: 1 hour
const FAILED_PERP_KEY = "failedBybitPerpCoins";

// Add a failed coin (if not already present)
function addFailedBybitPerpCoin(symbol) {
  const current = cache.get(FAILED_PERP_KEY) || [];
  if (!current.includes(symbol)) {
    current.push(symbol);
    cache.set(FAILED_PERP_KEY, current);
  }
}

// Add multiple failed coins at once
function addFailedBybitPerpCoins(symbols) {
  const current = cache.get(FAILED_PERP_KEY) || [];
  const updated = [...new Set([...current, ...symbols])];
  cache.set(FAILED_PERP_KEY, updated);
}

// Get current list of failed perp coins
function getFailedBybitPerpCoins() {
  return cache.get(FAILED_PERP_KEY) || [];
}

// Clear all failed coins
function clearFailedBybitPerpCoins() {
  cache.del(FAILED_PERP_KEY);
}

module.exports = {
  addFailedBybitPerpCoin,
  addFailedBybitPerpCoins,
  getFailedBybitPerpCoins,
  clearFailedBybitPerpCoins,
};
