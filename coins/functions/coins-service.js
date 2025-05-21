const { binanceDominantCache, bybitDominantCache } = require("./coins-cache");
const ServantsConfigOperator = require("../../functions/global/servants/servants-config");

// Fetch coins from DB
async function fetchDominantCoinsFromDb(dominant, coinType) {
  const config = ServantsConfigOperator.getConfig();
  if (!config?.coinsApi) {
    throw new Error("Missing COINS API configuration");
  }

  console.log("COINS API", config.coinsApi);
  const url = `${config.coinsApi}/api/coins/sorted?dominant=${dominant}&coinType=${coinType}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${errorText}`);
  }

  return await response.json();
}

async function initializeCoinsCache() {
  const [
    binanceDominantPerps,
    binanceDominantSpot,
    bybitDominantPerps,
    bybitDominantSpot,
  ] = await Promise.all([
    fetchDominantCoinsFromDb("Binance", "perp"),
    fetchDominantCoinsFromDb("Binance", "spot"),
    fetchDominantCoinsFromDb("Bybit", "perp"),
    fetchDominantCoinsFromDb("Bybit", "spot"),
  ]);

  binanceDominantCache.binancePerp.set(
    "coins",
    binanceDominantPerps.binanceCoins
  );
  binanceDominantCache.binanceSpot.set(
    "coins",
    binanceDominantSpot.binanceCoins
  );
  binanceDominantCache.bybitPerp.set("coins", binanceDominantPerps.bybitCoins);
  binanceDominantCache.bybitSpot.set("coins", binanceDominantSpot.bybitCoins);

  //BYBIT DOMINANT
  bybitDominantCache.binancePerp.set("coins", bybitDominantPerps.binanceCoins);
  bybitDominantCache.binanceSpot.set("coins", bybitDominantSpot.binanceCoins);
  bybitDominantCache.bybitPerp.set("coins", bybitDominantPerps.bybitCoins);
  bybitDominantCache.bybitSpot.set("coins", bybitDominantSpot.bybitCoins);
}

function getBinanceDominantCache() {
  return {
    binancePerps: binanceDominantCache.binancePerp.get("coins"),
    binanceSpot: binanceDominantCache.binanceSpot.get("coins"),
    bybitPerps: binanceDominantCache.bybitPerp.get("coins"),
    bybitSpot: binanceDominantCache.bybitSpot.get("coins"),
  };
}

function getBybitDominantCache() {
  return {
    binancePerps: bybitDominantCache.binancePerp.get("coins"),
    binanceSpot: bybitDominantCache.binanceSpot.get("coins"),
    bybitPerps: bybitDominantCache.bybitPerp.get("coins"),
    bybitSpot: bybitDominantCache.bybitSpot.get("coins"),
  };
}

module.exports = {
  initializeCoinsCache,
  getBinanceDominantCache,
  getBybitDominantCache,
};
