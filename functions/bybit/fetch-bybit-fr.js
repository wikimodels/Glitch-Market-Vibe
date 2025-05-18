const { bybitFrUrl } = require("./bybit-fr-url.js");

async function fetchBybitFr(coins, limit) {
  const promises = coins.map(async (coin) => {
    try {
      const url = bybitFrUrl(coin.symbol, limit);
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

      // 1. Сортировка по времени (от старых к новым)
      const rawEntries = responseData.result.list
        .map((entry) => ({
          ...entry,
          fundingRateTimestamp: Number(entry.fundingRateTimestamp),
          fundingRate: Number(entry.fundingRate),
        }))
        .sort((a, b) => a.fundingRateTimestamp - b.fundingRateTimestamp); // Убедитесь, что данные в правильном порядке

      // 2. Вычисляем интервал между записями (в миллисекундах)
      const baseInterval =
        rawEntries.length >= 2
          ? rawEntries[1].fundingRateTimestamp -
            rawEntries[0].fundingRateTimestamp
          : 8 * 3600 * 1000;

      // 3. Обработка данных
      const data = rawEntries.map((entry, index, arr) => {
        const currentRate = entry.fundingRate;
        const openTime = entry.fundingRateTimestamp;
        const closeTime = openTime + baseInterval - 1;

        let fundingRateChange = null;

        if (index > 0) {
          const prevRate = Number(arr[index - 1].fundingRate);

          if (prevRate !== 0) {
            fundingRateChange = Number(
              (((currentRate - prevRate) / Math.abs(prevRate)) * 100).toFixed(2)
            );
          } else {
            fundingRateChange = currentRate !== 0 ? 100 : null; // Если предыдущий 0, но текущий > 0 → +100%
          }
        }

        return {
          openTime,
          closeTime,
          fundingRate: currentRate,
          fundingRateChange:
            fundingRateChange !== null
              ? Number(fundingRateChange.toFixed(2))
              : null,
        };
      });

      return {
        symbol: coin.symbol,
        exchanges: coin.exchanges,
        imageUrl: coin.imageUrl,
        category: coin.category,
        data: data.slice(1),
      };
    } catch (error) {
      console.error(`Error processing ${coin.symbol}:`, error);
      return { symbol: coin.symbol, data: [] };
    }
  });

  return Promise.all(promises);
}

module.exports = { fetchBybitFr };
