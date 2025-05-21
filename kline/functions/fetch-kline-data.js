// open-interest.service.js

const {
  mergeSpotWithPerps,
} = require("../functions/processing/merge-spot-with-perps");

const {
  calculateExpirationTime,
} = require("../../functions/shared/calculations/calculate-expiration-time.js");

const {
  getBinanceDominantCache,
} = require("../../coins/functions/coins-service");

const {
  normalizeKlineData,
} = require("../functions/processing/normalize-kline-data");

const {
  handleFetchWithFailureTracking,
} = require("../../functions/shared/handle-fetch-with-failure-tracking");

const {
  fetchBinancePerpKlines,
} = require("../functions/fetches/fetch-binance-perp-klines");

const {
  fetchBybitPerpKlines,
} = require("../functions/fetches/fetch-bybit-perp-klines.js");

const {
  fetchBinanceSpotKlines,
} = require("../functions/fetches/fetch-binance-spot-klines.js");

const {
  fetchBybitSpotKlines,
} = require("../functions/fetches/fetch-bybit-spot-klines.js");

const { addFailedCoinsToCache } = require("./add-failed-coins-to-cache.js");

async function fetchKlineData(timeframe, limit) {
  const { binancePerps, binanceSpot, bybitPerps, bybitSpot } =
    getBinanceDominantCache();

  const [
    binanceKlinePerpData,
    bybitKlinePerpData,
    binanceKlineSpotData,
    bybitKlineSpotData,
  ] = await Promise.all([
    handleFetchWithFailureTracking(
      fetchBinancePerpKlines,
      binancePerps,
      timeframe,
      limit,
      addFailedCoinsToCache,
      "perp",
      "Binance"
    ),
    handleFetchWithFailureTracking(
      fetchBybitPerpKlines,
      bybitPerps,
      timeframe,
      limit,
      addFailedCoinsToCache,
      "perp",
      "Bybit"
    ),
    handleFetchWithFailureTracking(
      fetchBinanceSpotKlines,
      binanceSpot,
      timeframe,
      limit,
      addFailedCoinsToCache,
      "spot",
      "Binance"
    ),
    handleFetchWithFailureTracking(
      fetchBybitSpotKlines,
      bybitSpot,
      timeframe,
      limit,
      addFailedCoinsToCache,
      "spot",
      "Bybit"
    ),
  ]);

  console.log("binanceKlinePerpData", binanceKlinePerpData.length);
  console.log("bybitKlinePerpData", bybitKlinePerpData.length);
  console.log("binanceKlineSpotData", binanceKlineSpotData.length);
  console.log("bybitKlineSpotData", bybitKlineSpotData.length);

  //3. Calculate when this data should expire
  const lastOpenTime =
    bybitKlinePerpData[0]?.data?.at(-1)?.openTime ??
    bybitKlinePerpData[0]?.data?.at(-1)?.openTime;
  // const expirationTime = calculateExpirationTime(lastOpenTime, timeframe);

  let data = mergeSpotWithPerps(
    [...binanceKlinePerpData, ...bybitKlinePerpData],
    [...binanceKlineSpotData, ...bybitKlineSpotData]
  );

  //4. Normalize and merge
  data = normalizeKlineData([...data]);

  return { expirationTime: 0, data };
}

module.exports = { fetchKlineData };
