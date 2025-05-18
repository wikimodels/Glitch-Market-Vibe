const { getBinanceKlineInterval } = require("./get-binance-kline-interval.js");
const { binancePerpsUrl } = require("./binance-perps-url.js");

async function fetchBinancePerpKlines(coins, timeframe, limit) {
  const binanceInterval = getBinanceKlineInterval(timeframe);

  const promises = coins.map(async (coin) => {
    try {
      // Configure headers for Binance
      const headers = new Headers();
      headers.set(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
      );
      headers.set("Accept", "*/*");
      headers.set("Accept-Language", "en-US,en;q=0.9");
      headers.set("Origin", "https://www.binance.com");
      headers.set("Referer", "https://www.binance.com/");

      const url = binancePerpsUrl(coin.symbol, binanceInterval, limit);

      const response = await fetch(url, { headers });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${coin.symbol}:`, errorText);
        return { success: false, symbol: coin.symbol };
      }

      const responseData = await response.json();
      if (!Array.isArray(responseData)) {
        console.error(
          `Invalid response structure for ${coin.symbol}:`,
          responseData
        );
        return { success: false, symbol: coin.symbol };
      }

      const data = responseData
        .sort((a, b) => a[0] - b[0])
        .map((entry) => {
          const baseVolume = parseFloat(entry[5]);
          const takerBuyBase = parseFloat(entry[9]);
          const takerBuyQuote = parseFloat(entry[10]);
          const totalQuoteVolume = parseFloat(entry[7]);

          const buyerRatio =
            baseVolume > 0
              ? Math.round((takerBuyBase / baseVolume) * 100 * 100) / 100
              : 0;

          const sellerQuoteVolume = (totalQuoteVolume - takerBuyQuote).toFixed(
            2
          );
          const volumeDelta = (takerBuyQuote - sellerQuoteVolume).toFixed(2);

          return {
            openTime: parseFloat(entry[0]),
            closeTime: parseFloat(entry[6]),
            closePrice: parseFloat(entry[4]),
            quoteVolume: parseFloat(totalQuoteVolume),
            buyerRatio: parseFloat(buyerRatio),
            volumeDelta: parseFloat(volumeDelta),
          };
        });

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

module.exports = { fetchBinancePerpKlines };
