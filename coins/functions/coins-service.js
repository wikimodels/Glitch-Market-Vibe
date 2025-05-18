// coinService.js

const coinsCache = require("./coins-cache");
const ServantsConfigOperator = require("../../functions/global/servants/servants-config");
const { getFailedBinancePerpCoins } = require("./failed-binance-perp-coins");
const { getFailedBinanceSpotCoins } = require("./failed-binance-sport-coins");
const { getFailedBybitPerpCoins } = require("./failed-bybit-perp-coins");
const { getFailedBybitSpotCoins } = require("./failed-bybit-sport-coins");

// Function to fetch coins from the database
async function fetchCoinsFromDb() {
  const config = ServantsConfigOperator.getConfig();
  const url = config.coinsApi;

  if (!url) {
    throw new Error("Missing COINS URL configuration");
  }

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${errorText}`);
  }

  const coinsData = await response.json();
  return coinsData.coins;
}

async function initializeCoinsCache() {
  const coins = await fetchCoinsFromDb();
  storeCoinsInCache(coins);
}

// Function to store coins in the cache
function storeCoinsInCache(coins) {
  coinsCache.set("coins", coins);
}

// Function to retrieve coins from the cache
function getCoinsFromCache() {
  return coinsCache.get("coins");
}

// Function to reset the coins cache
function resetCoinsCache() {
  cache.del("coins");
}

function fetchDominantCoinsFromCache(dominant = "Binance") {
  const coins = getCoinsFromCache();

  const isBinance = (coin) => coin?.exchanges?.includes?.("Binance");
  const isBybit = (coin) => coin?.exchanges?.includes?.("Bybit");

  let binanceCoins, bybitCoins;

  if (dominant === "Binance") {
    binanceCoins = coins.filter(isBinance);
    bybitCoins = coins.filter((c) => isBybit(c) && !isBinance(c));
  } else if (dominant === "Bybit") {
    bybitCoins = coins.filter(isBybit);
    binanceCoins = coins.filter((c) => isBinance(c) && !isBybit(c));
  } else {
    throw new Error("Invalid dominant exchange specified");
  }

  const failedBinancePerpSymbols = getFailedBinancePerpCoins();
  const failedBinanceSpotSymbols = getFailedBinanceSpotCoins();
  const failedBybitPerpSymbols = getFailedBybitPerpCoins();
  const failedBybitSpotSymbols = getFailedBybitSpotCoins();

  const binancePerpCoins = binanceCoins.filter(
    (c) => !failedBinancePerpSymbols.includes(c.symbol)
  );
  const binanceSpotCoins = binanceCoins.filter(
    (c) => !failedBinanceSpotSymbols.includes(c.symbol)
  );
  const bybitPerpCoins = bybitCoins.filter(
    (c) => !failedBybitPerpSymbols.includes(c.symbol)
  );
  const bybitSpotCoins = bybitCoins.filter(
    (c) => !failedBybitSpotSymbols.includes(c.symbol)
  );

  return {
    binancePerpCoins,
    binanceSpotCoins,
    bybitPerpCoins,
    bybitSpotCoins,
  };
}

module.exports = {
  fetchCoinsFromDb,
  storeCoinsInCache,
  getCoinsFromCache,
  resetCoinsCache,
  fetchDominantCoinsFromCache,
  initializeCoinsCache,
};
