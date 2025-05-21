const NodeCache = require("node-cache");

// Binance dominant cache group
const binanceCoinsBinancePerpCache = new NodeCache({ stdTTL: 0 });
const binanceCoinsBybitPerpCache = new NodeCache({ stdTTL: 0 });
const binanceCoinsBinanceSpotCache = new NodeCache({ stdTTL: 0 });
const binanceCoinsBybitSpotCache = new NodeCache({ stdTTL: 0 });

const binanceDominantCache = {
  binancePerp: binanceCoinsBinancePerpCache,
  bybitPerp: binanceCoinsBybitPerpCache,
  binanceSpot: binanceCoinsBinanceSpotCache,
  bybitSpot: binanceCoinsBybitSpotCache,
};

// Bybit dominant cache group (separate instances)
const bybitCoinsBinancePerpCache = new NodeCache({ stdTTL: 0 });
const bybitCoinsBybitPerpCache = new NodeCache({ stdTTL: 0 });
const bybitCoinsBinanceSpotCache = new NodeCache({ stdTTL: 0 });
const bybitCoinsBybitSpotCache = new NodeCache({ stdTTL: 0 });

const bybitDominantCache = {
  binancePerp: bybitCoinsBinancePerpCache,
  bybitPerp: bybitCoinsBybitPerpCache,
  binanceSpot: bybitCoinsBinanceSpotCache,
  bybitSpot: bybitCoinsBybitSpotCache,
};

module.exports = {
  binanceDominantCache,
  bybitDominantCache,
};
