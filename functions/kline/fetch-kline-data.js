// open-interest.service.js
const coinsCache = require("./coins-cache");
const { addFailedCoinsToCache } = require("../coins/functions/coins-service");
const {
  fetchBinancePerpKlines,
} = require("../binance/fetch-binance-perp-klines");
const { fetchBybitPerpKlines } = require("../bybit/fetch-bybit-perp-klines");
const {
  fetchBinanceSpotKlines,
} = require("../binance/fetch-binance-spot-klines");
const { fetchBybitSpotKlines } = require("../bybit/fetch-bybit-spot-klines");

const {
  mergeSpotWithPerps,
} = require("../utility/merges/merge-spot-with-perps");

const {
  calculateExpirationTime,
} = require("../utility/calculate-expiration-time");

const { normalizeKlineData } = require("../normalize/normalize-kline-data");

const {
  handleFetchWithFailureTracking,
} = require("./handle-fetch-with-failure-tracking");

async function fetchKlineData(timeframe, limit) {
  const [
    binanceKlinePerpData,
    bybitKlinePerpData,
    binanceKlineSpotData,
    bybitKlineSpotData,
  ] = await Promise.all([
    handleFetchWithFailureTracking(
      fetchBinancePerpKlines,
      coinsCache.binancePerpCoins(),
      timeframe,
      limit,
      addFailedCoinsToCache,
      "perp",
      "Binance"
    ),
    handleFetchWithFailureTracking(
      fetchBybitPerpKlines,
      coinsCache.bybitPerpCoins(),
      timeframe,
      limit,
      addFailedCoinsToCache,
      "perp",
      "Bybit"
    ),
    handleFetchWithFailureTracking(
      fetchBinanceSpotKlines,
      coinsCache.binanceSpotCoins(),
      timeframe,
      limit,
      addFailedCoinsToCache,
      "spot",
      "Binance"
    ),
    handleFetchWithFailureTracking(
      fetchBybitSpotKlines,
      coinsCache.bybitSpotCoins(),
      timeframe,
      limit,
      addFailedCoinsToCache,
      "spot",
      "Bybit"
    ),
  ]);

  // 3. Calculate when this data should expire
  const lastOpenTime =
    bybitKlinePerpData[0]?.data?.at(-1)?.openTime ??
    bybitKlinePerpData[0]?.data?.at(-1)?.openTime;
  const expirationTime = calculateExpirationTime(lastOpenTime, timeframe);

  let data = mergeSpotWithPerps(
    [...binanceKlinePerpData, ...bybitKlinePerpData],
    [...binanceKlineSpotData, ...bybitKlineSpotData]
  );

  //4. Normalize and merge
  data = normalizeKlineData([...data]);

  return { expirationTime, data };
}

module.exports = { fetchKlineData };
