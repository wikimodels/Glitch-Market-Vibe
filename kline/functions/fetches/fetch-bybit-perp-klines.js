const {
  getIntervalDurationMs,
} = require("../../../functions/shared/get-interval-duration-ms.js");
const {
  calculateCloseTime,
} = require("../../../functions/shared/calculations/calculate-close-time.js");
const {
  getBybitKlineInterval,
} = require("../intervals/get-bybit-kline-interval");
const { bybitPerpUrl } = require("../../urls/bybit-perps-url.js");

async function fetchBybitPerpKlines(coins, timeframe, limit) {
  const intervalMs = getIntervalDurationMs(timeframe);
  const bybitInterval = getBybitKlineInterval(timeframe);

  const promises = coins.map(async (coin) => {
    try {
      const url = bybitPerpUrl(coin.symbol, bybitInterval, limit);

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${coin.symbol}:`, errorText);
        return { success: false, symbol: coin.symbol };
      }

      const responseData = await response.json();

      if (
        !responseData?.result?.list ||
        !Array.isArray(responseData.result.list)
      ) {
        console.error(
          `Invalid response structure for ${coin.symbol}:`,
          responseData
        );
        return { success: false, symbol: coin.symbol };
      }

      const rawEntries = responseData.result.list.sort((a, b) => a[0] - b[0]);

      const data = rawEntries
        .filter((entry) => Array.isArray(entry) && entry.length >= 7)
        .map((entry) => ({
          openTime: Number(entry[0]),
          closeTime: calculateCloseTime(Number(entry[0]), intervalMs),
          openPrice: Number(entry[1]),
          highPrice: Number(entry[2]),
          lowPrice: Number(entry[3]),
          closePrice: Number(entry[4]),
          quoteVolume: Number(entry[6]),
        }));

      return {
        success: true,
        data: {
          symbol: coin.symbol,
          category: coin.category || "unknown",
          exchanges: coin.exchanges || [],
          imageUrl: coin.imageUrl || "assets/img/noname.png",
          data: data.slice(1, -1),
        },
      };
    } catch (error) {
      console.error(`Error processing ${coin.symbol}:`, error);
      return { success: false, symbol: coin.symbol };
    }
  });

  return Promise.all(promises);
}

module.exports = { fetchBybitPerpKlines };
