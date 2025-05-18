const { getBybitOiInterval } = require("./get-bybit-oi-interval.js");
const { bybitOiUrl } = require("./bybit-oi-url.js");
const { calculateCloseTime } = require("../utility/calculate-close-time.js");
const {
  getIntervalDurationMs,
} = require("../utility/get-interval-duration-ms.js");

async function fetchBybitOi(coins, timeframe, limit) {
  const bybitInterval = getBybitOiInterval(timeframe);
  const intervalMs = getIntervalDurationMs(timeframe);

  const promises = coins.map(async (coin) => {
    try {
      const url = bybitOiUrl(coin.symbol, bybitInterval, limit);
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${coin.symbol}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (
        !responseData?.result?.list ||
        !Array.isArray(responseData.result.list)
      ) {
        console.error(`Invalid response for ${coin.symbol}:`, responseData);
        throw new Error(`Invalid response for ${coin.symbol}`);
      }

      const rawEntries = responseData.result.list;
      const data = rawEntries
        .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
        .map((entry, index, arr) => {
          const currentValue = Number(entry.openInterest);

          let openInterestChange = null;
          if (index > 0) {
            const prevValue = Number(arr[index - 1].openInterest);
            if (prevValue !== 0) {
              openInterestChange = Number(
                (
                  ((currentValue - prevValue) / Math.abs(prevValue)) *
                  100
                ).toFixed(2)
              );
            } else {
              openInterestChange = currentValue !== 0 ? 100 : 0;
            }
          }

          return {
            symbol: coin.symbol,
            openTime: Number(entry.timestamp),
            closeTime: calculateCloseTime(Number(entry.timestamp), intervalMs),
            openInterest: Number(currentValue.toFixed(2)),
            openInterestChange:
              openInterestChange !== null
                ? Number(openInterestChange.toFixed(2))
                : null,
          };
        });

      // Удаляем только первый элемент (где openInterestChange = null)
      const cleanedData = data.slice(1, -1);

      return {
        symbol: coin.symbol,
        exchanges: coin.exchanges || [],
        imageUrl: coin.imageUrl || "",
        category: coin.category || "",
        data: cleanedData,
      };
    } catch (error) {
      console.error(`Error processing ${coin.symbol}:`, error);
      return { symbol: coin.symbol, data: [] };
    }
  });

  return Promise.all(promises);
}

module.exports = { fetchBybitOi };
