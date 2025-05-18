// open-interest.service.js
const {
  fetchDominantCoinsFromCache,
} = require("../../coins/functions/coins-service");
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

const {
  addFailedBinancePerpCoin,
} = require("../../coins/functions/failed-binance-perp-coins");
const {
  addFailedBinanceSpotCoin,
} = require("../../coins/functions/failed-binance-sport-coins");
const {
  addFailedBybitPerpCoin,
} = require("../../coins/functions/failed-bybit-perp-coins");
const {
  addFailedBybitSpotCoin,
} = require("../../coins/functions/failed-bybit-sport-coins");

async function fetchKlineData(timeframe, limit) {
  // 1. Choose the correct cache-fetch function based on timeframe

  const { binancePerpCoins, binanceSpotCoins, bybitPerpCoins, bybitSpotCoins } =
    fetchDominantCoinsFromCache();

  const [
    binanceKlinePerpData,
    bybitKlinePerpData,
    binanceKlineSpotData,
    bybitKlineSpotData,
  ] = await Promise.all([
    handleFetchWithFailureTracking(
      fetchBinancePerpKlines,
      binancePerpCoins.slice(0, 6),
      timeframe,
      limit,
      addFailedBinancePerpCoin
    ),
    handleFetchWithFailureTracking(
      fetchBybitPerpKlines,
      bybitPerpCoins.slice(0, 6),
      timeframe,
      limit,
      addFailedBybitPerpCoin
    ),
    handleFetchWithFailureTracking(
      fetchBinanceSpotKlines,
      binanceSpotCoins.slice(0, 2),
      timeframe,
      limit,
      addFailedBinanceSpotCoin
    ),
    handleFetchWithFailureTracking(
      fetchBybitSpotKlines,
      bybitSpotCoins.slice(0, 2),
      timeframe,
      limit,
      addFailedBybitSpotCoin
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
