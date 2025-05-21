const {
  getBybitKlineInterval,
} = require("../intervals/get-bybit-kline-interval.js");
const { bybitSpotUrl } = require("../../urls/bybit-spot-url.js");

async function fetchBybitSpotKlines(coins, timeframe, limit) {
  const bybitInterval = getBybitKlineInterval(timeframe);

  const promises = coins.map(async (coin) => {
    try {
      const url = bybitSpotUrl(coin.symbol, bybitInterval, limit);

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
          symbol: coin.symbol,
          openTime: Number(entry[0]),
          closePrice: Number(entry[4]),
        }));

      // Drop the last candle (incomplete current period)

      return {
        success: true,
        data: {
          symbol: coin.symbol,
          category: coin.category || "unknown",
          exchanges: coin.exchanges || [],
          imageUrl: coin.imageUrl || "assets/img/noname.png",
          data: data.slice(0, -1),
        },
      };
    } catch (error) {
      console.error(`Error processing ${coin.symbol}:`, error);
      return { success: false, symbol: coin.symbol };
    }
  });

  return Promise.all(promises);
}

module.exports = { fetchBybitSpotKlines };
